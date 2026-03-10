// prisma/seed.ts

/**
 * Master Seed Orchestrator
 * This script coordinates the execution of specialized seed scripts.
 * * Order of operations:
 * 1. seedUsers: Performs a destructive TRUNCATE and creates 21 Users / 42 Accounts.
 * 2. seedChallenges: Submits the 63 Challenges that form the basis of the Explorer content.
 * 3. seedPushes: Populates the 'pushes' table and synchronizes aggregate counters on Challenges and Users to reflect activity in the Explorer UI.
 * 
 * Each seed script is designed to be idempotent and can be run independently for testing purposes, but this master script ensures the correct order and handles any dependencies between them.
*/

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runMasterSeed() {
  console.log('-------------------------------------------------------');
  console.log('🌐 PERENNIAL MASTER SEED: Starting Orchestration...');
  console.log('-------------------------------------------------------');

  try {
    // Step 1: Seed Users and Identities
    // This script contains the TRUNCATE logic, so it MUST run first.
    console.log('\n[PHASE 1] Resetting Database & Seeding Users...');
    const { main: seedUsers } = await import('./seedUsers');
    await seedUsers();
    console.log('✅ Phase 1 Complete.');

    // Step 2: Seed Challenges
    // This script relies on the Users/Tokens created in Phase 1.
    console.log('\n[PHASE 2] Seeding 42 Strategic Challenges...');
    const { main: seedChallenges } = await import('./seedChallenges');
    await seedChallenges();
    console.log('✅ Phase 2 Complete.');

    // Step 3: Seed Pushes
    // This script populates the push history for the explorer/activity feed.
    console.log('\n[PHASE 3] Seeding Push Notification History...');
    const { main: seedPushes } = await import('./seedPushes');
    await seedPushes();
    console.log('✅ Phase 3 Complete.');

  } catch (error) {
    console.error('\n❌ CRITICAL: Master Seed process failed.');
    console.error(error);
    process.exit(1);
  } finally {
    // Ensure the master client is disconnected
    await prisma.$disconnect();
    console.log('\n-------------------------------------------------------');
    console.log('✨ MASTER SEED COMPLETE');
    console.log('-------------------------------------------------------');
  }
}

// Execute the master seed
runMasterSeed().catch((err) => {
  console.error(err);
  process.exit(1);
});