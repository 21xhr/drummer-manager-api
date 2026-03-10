// prisma/seedPushes.ts
/**
 * Push Seeding Script
 * This script seeds push activity across the challenge pool using a weighted distribution of user types
 * (whales, regulars, lurkers) and challenge groups (trending, niche, and selected diversified entries).
 * It also synchronizes aggregate counters on both Challenge and User records so the Explorer reflects the seeded activity accurately.
 */

import { PrismaClient } from '@prisma/client';
import logger from '../src/logger';


const prisma = new PrismaClient();

const getSeedPushQuantity = (): number => {
  const roll = Math.random();

  if (roll > 0.92) return Math.floor(Math.random() * 8) + 5; // 5-12
  if (roll > 0.72) return Math.floor(Math.random() * 3) + 2; // 2-4
  return 1;
};

const calculateSeedPushCost = (
  pushBaseCost: number,
  currentUserPushCount: number,
  quantity: number
): number => {
  let totalCost = BigInt(0);
  const baseCost = BigInt(pushBaseCost);

  for (let i = 1; i <= quantity; i++) {
    const incrementalCount = BigInt(currentUserPushCount + i);
    totalCost += baseCost * (incrementalCount * incrementalCount);
  }

  return Number(totalCost);
};

export async function main() {
  logger.info('🚀 SEED: Starting PUSH (Activity) Seeding...');

  // 1. Fetch Users and Challenges
  const users = await prisma.user.findMany({
    where: { id: { gte: 2, lte: 20 } },
    include: { accounts: true }
  });

  const challenges = await prisma.challenge.findMany({
    orderBy: { challengeId: 'asc' }
  });

  const userChallengePushCounts: Record<string, number> = {};

  if (users.length === 0 || challenges.length === 0) {
    logger.error('❌ Missing dependencies. Run User and Challenge seeds first.');
    return;
  }

  // 2. Distribution Logic
  const whales = users.slice(0, 3);
  const regulars = users.slice(3, 8);
  const lurkers = users.slice(8);

  const activeChallenges = challenges.filter(c => c.status === 'ACTIVE');
  const executionTierChallenges = challenges.filter(c =>
    c.status === 'IN_PROGRESS' ||
    c.status === 'COMPLETED' ||
    c.status === 'FAILED'
  );
  const archivedChallenges = challenges.filter(c => c.status === 'ARCHIVED');
  const auctionedChallenges = challenges.filter(c => c.status === 'AUCTIONED');
  const removedChallenges = challenges.filter(c => c.status === 'REMOVED');
  const underReviewChallenges = challenges.filter(c => c.status === 'UNDER_REVIEW');

  const diversifiedChallenges = challenges.filter(c => {
    const goal =
      typeof c.challengeText === 'object' && c.challengeText && 'goal' in c.challengeText
        ? String((c.challengeText as any).goal || '')
        : '';
    return goal.startsWith('[DIVERSIFIED]');
  });

  const trendingChallenges = [
    ...activeChallenges.slice(0, 4),
    ...executionTierChallenges.slice(0, 6)
  ];

  const nicheChallenges = [
    ...activeChallenges.slice(4, 12),
    ...archivedChallenges.slice(0, 5),
    ...auctionedChallenges.slice(0, 3),
    ...removedChallenges.slice(0, 3),
    ...underReviewChallenges.slice(0, 2),
    ...diversifiedChallenges.slice(0, 8)
  ];

  const pushesToCreate = 150;
  let createdCount = 0;

  // Track aggregates in memory to sync at the end
  const challengeStats: Record<number, { cost: number; pushes: number; uniqueUsers: Set<number> }> = {};
  const userStats: Record<number, { spent: number; pushes: number }> = {};
  let totalPushSpendingGenerated = 0;

  for (let i = 0; i < pushesToCreate; i++) {
    const roll = Math.random();
    let sender = roll > 0.4 ? whales[Math.floor(Math.random() * whales.length)] :
                 roll > 0.1 ? regulars[Math.floor(Math.random() * regulars.length)] :
                 lurkers[Math.floor(Math.random() * lurkers.length)];

    const challengeRoll = Math.random();
    let targetPool = nicheChallenges;

    if (challengeRoll > 0.55) {
      targetPool = trendingChallenges;
    } else if (challengeRoll > 0.25) {
      targetPool = nicheChallenges;
    } else if (challengeRoll > 0.12 && underReviewChallenges.length) {
      targetPool = underReviewChallenges;
    } else if (challengeRoll > 0.06 && removedChallenges.length) {
      targetPool = removedChallenges;
    } else if (auctionedChallenges.length) {
      targetPool = auctionedChallenges;
    }

    const targetChallenge = targetPool[Math.floor(Math.random() * targetPool.length)];

    const quantity = getSeedPushQuantity();
    const trackerKey = `${sender.id}-${targetChallenge.challengeId}`;
    const currentUserPushCount = userChallengePushCounts[trackerKey] ?? 0;
    const cost = calculateSeedPushCost(
      targetChallenge.pushBaseCost,
      currentUserPushCount,
      quantity
    );
    const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

    try {
      await prisma.push.create({
        data: {
          cost,
          quantity,
          userId: sender.id,
          challengeId: targetChallenge.challengeId,
          timestamp
        }
      });

      userChallengePushCounts[trackerKey] = currentUserPushCount + quantity;

      // Update memory trackers for the Sync Phase
      const cId = targetChallenge.challengeId;
      if (!challengeStats[cId]) challengeStats[cId] = { cost: 0, pushes: 0, uniqueUsers: new Set() };
      challengeStats[cId].cost += cost;
      challengeStats[cId].pushes += quantity;
      challengeStats[cId].uniqueUsers.add(sender.id);

      if (!userStats[sender.id]) userStats[sender.id] = { spent: 0, pushes: 0 };
      userStats[sender.id].spent += cost;
      userStats[sender.id].pushes += quantity;
      
      totalPushSpendingGenerated += cost;

      createdCount++;
    } catch (e) {
      logger.error('❌ Failed to create push:', e);
    }
  }

  // 3. SYNC PHASE: Update Challenge & User Aggregates
  logger.info('🔄 SYNC: Updating Challenge and User counters...');

  for (const [cId, stats] of Object.entries(challengeStats)) {
    await prisma.challenge.update({
      where: { challengeId: Number(cId) },
      data: {
        totalPush: { increment: stats.pushes },
        totalNumbersSpent: { increment: BigInt(stats.cost) },
        uniquePusher: { increment: stats.uniqueUsers.size }
      }
    });
  }

  for (const [uId, stats] of Object.entries(userStats)) {
    await prisma.user.update({
      where: { id: Number(uId) },
      data: {
        totalNumbersSpent: { increment: BigInt(stats.spent) },
        totalPushesExecuted: { increment: stats.pushes }
      }
    });
  }

  // 4. Update Global Ledger (User ID 1)
  // This accounts for all the Push spending generated in this seed.
  // Note: Challenge submission costs were already handled by the challengeService during Phase 2.
  logger.info(`🌐 GLOBAL LEDGER: Incrementing community spending by ${totalPushSpendingGenerated} (Push Activity Only)...`);
  await prisma.user.update({
    where: { id: 1 },
    data: {
      totalNumbersSpentGameWide: { increment: BigInt(totalPushSpendingGenerated) }
    }
  });

  logger.info(`✅ SEED COMPLETE: Generated ${createdCount} pushes and synced all counters.`);
}

// export default main;