// prisma/seedUsers.ts
/**
 * Database Seed Script for development and testing purposes. 
 * This script performs a destructive reset of the database, wiping all existing data and resetting ID counters to ensure a clean slate. 
 * It then creates a predefined set of 21 users and 42 accounts with specific relationships to facilitate testing of various scenarios in the application.
 */

import { PrismaClient, PlatformName } from '@prisma/client';

const prisma = new PrismaClient();

export async function main() {
  console.log('🚀 DESTRUCTIVE RESET: 21 Users / 42 Accounts ID Reset...');
  
  // These match your schema @@map attributes exactly
  const tables = [
    'temp_quotes', 
    'perennial_tokens', 
    'pushes',
    'challenges', 
    'accounts', 
    'users'
  ];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
    } catch (e) {
      console.error(`❌ Failed to truncate ${table}.`);
    }
  }

  const now = new Date();
  const allPlatforms = [PlatformName.TWITCH, PlatformName.KICK, PlatformName.YOUTUBE];

  // 1. System: Community Chest (ID 1)
  await prisma.user.create({
    data: { 
      id: 1, 
      dailyChallengeResetAt: now,
      totalDigoutsExecuted: 0 
    }
  });

  // 2. Master Identity: User 21 (Linked Triple)
  await prisma.user.create({
    data: {
      id: 21,
      dailyChallengeResetAt: now,
      accounts: {
        create: [
          { platformId: '686071308', platformName: PlatformName.TWITCH, username: '21xhr', currentBalance: 21000000 },
          { platformId: '53255028', platformName: PlatformName.KICK, username: '21xhr', currentBalance: 21000000 },
          { platformId: 'dTQg5JKFl-YiPzg0UQdqng', platformName: PlatformName.YOUTUBE, username: '21xhr', currentBalance: 21000000 },
        ]
      }
    }
  });

  await prisma.perennialToken.create({
    data: { 
      token: 'master_demo_token', 
      userId: 21, 
      platformId: '686071308', 
      platformName: PlatformName.TWITCH 
    }
  });

  // 3. Bots: Users 2 through 20 (Targeting 42 total accounts)
  let remainingAccountSlots = 39;

  for (let i = 2; i <= 20; i++) {
    const isLastBot = i === 20;
    let accountCount = isLastBot 
      ? remainingAccountSlots 
      : Math.min(Math.floor(Math.random() * 3) + 1, remainingAccountSlots - (20 - i));
    
    if (accountCount < 1) accountCount = 1; 
    remainingAccountSlots -= accountCount;

    const shuffledPlatforms = [...allPlatforms].sort(() => Math.random() - 0.5);
    const selectedPlatforms = shuffledPlatforms.slice(0, accountCount);

    const userData = await prisma.user.create({
      data: {
        id: i,
        dailyChallengeResetAt: now,
        accounts: {
          create: selectedPlatforms.map((plat) => {
            // APPLYING SOLO PREFIX LOGIC
            const isSolo = accountCount === 1;
            const prefix = isSolo ? 'solo_' : 'linked_';
            
            return {
              platformId: `${prefix}${plat.toLowerCase()}_${i}`,
              platformName: plat,
              username: `${getStrategyName(accountCount)}_${plat}_${i}`,
              currentBalance: 21000000,
            };
          })
        }
      },
      include: { accounts: true }
    });

    await prisma.perennialToken.create({
      data: { 
        token: `test_token_${i}`, 
        userId: i, 
        platformId: userData.accounts[0].platformId, 
        platformName: userData.accounts[0].platformName 
      }
    });
  }

  const userCount = await prisma.user.count();
  const accCount = await prisma.account.count();
  console.log(`✅ SUCCESS: Created ${userCount} Users and ${accCount} Accounts.`);
  console.log(`🤖 Solo accounts now have "solo_" prefix in platformId.`);
}

function getStrategyName(count: number): string {
  if (count === 1) return 'Solo';
  if (count === 2) return 'Duo';
  return 'Triple';
}

// main()
//   .catch(e => { console.error(e); process.exit(1); })
//   .finally(async () => { await prisma.$disconnect(); });