// prisma/seedPushes.ts

// prisma/seedPushes.ts

import { PrismaClient } from '@prisma/client';
import logger from '../src/logger';

/**
 * Push Seeding Script
 * This script populates the 'pushes' table and SYNCHRONIZES the aggregate 
 * counters on Challenges and Users to ensure the Explorer UI reflects the data.
 */

const prisma = new PrismaClient();

export async function main() {
  logger.info('🚀 SEED: Starting PUSH (Activity) Seeding...');

  // 1. Fetch Users and Challenges
  const users = await prisma.user.findMany({
    where: { id: { gte: 2, lte: 20 } },
    include: { accounts: true }
  });

  const challenges = await prisma.challenge.findMany();

  if (users.length === 0 || challenges.length === 0) {
    logger.error('❌ Missing dependencies. Run User and Challenge seeds first.');
    return;
  }

  // 2. Distribution Logic
  const whales = users.slice(0, 3);
  const regulars = users.slice(3, 8);
  const lurkers = users.slice(8);

  const trendingChallenges = challenges.slice(0, 5);
  const nicheChallenges = challenges.slice(5, 20);

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
    let targetChallenge = challengeRoll > 0.3 ? trendingChallenges[Math.floor(Math.random() * trendingChallenges.length)] :
                          nicheChallenges[Math.floor(Math.random() * nicheChallenges.length)];

    const baseAmount = roll > 0.4 ? 500000 : 100000;
    const cost = Math.floor(Math.random() * baseAmount) + 50000;
    const quantity = Math.random() > 0.8 ? Math.floor(Math.random() * 4) + 2 : 1;
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