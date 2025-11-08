// src/index.ts
// This file sets up and starts the core web server (API) and the daily scheduler.

// Enables graceful error handling for async routes, 
// preventing the application from crashing on unhandled async exceptions.
import 'express-async-errors'; 
import express, { Request, Response } from 'express';
import * as cron from 'node-cron'; // <-- NEW: Import the scheduling library

import prisma from './prisma'; 
import userRoutes from './routes/userRoutes'; 
import streamRoutes from './routes/streamRoutes';

// --- NEW IMPORTS for Scheduling ---
import { initializeStreamState, getCurrentStreamDay } from './services/streamService'; 
import { archiveExpiredChallenges } from './services/challengeService';
import { processDailyUserTick } from './services/clockService'; 
// NOTE: We need a function to safely increment the global clock in streamService.
// We'll define a placeholder function call for now. 
// You must implement this function in src/services/streamService.ts later.
import { incrementGlobalDayStat } from './services/streamService'; 


// --- Server Setup ---
const app = express();
const PORT = process.env.PORT || 3000; 

// --- Middleware ---
app.use(express.json());

// --- Application Routers (API Endpoints) ---
app.use('/api/v1/user', userRoutes); 
app.use('/api/v1/stream', streamRoutes);

// --- Basic Health Check Route ---
app.get('/', async (req: Request, res: Response) => {
  try {
    await prisma.$connect();
    res.status(200).json({
      message: "Drummer Manager API is running successfully!",
      status: "OK",
      dbStatus: "Connected to Supabase", 
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      message: "Drummer Manager API is running, but database connection failed.",
      status: "ERROR",
      dbStatus: "Failed to connect",
      timestamp: new Date().toISOString()
    });
  }
});


// --- Daily Scheduler (21:00 UTC Clock Tick) ---
/**
 * Executes daily maintenance tasks: Challenge archival and user day counter updates.
 * Runs every day at 21:00 UTC, aligning with daily game resets.
 */
cron.schedule('0 21 * * *', async () => {
    
    console.log('[Scheduler] Running Daily Archival and User Tick (21:00 UTC).');
    
    try {
        // 1. Get the current global day counter (Needed for the tick logic)
        const currentStreamDay = await getCurrentStreamDay();

        // 2. Run the Challenge Archival Clock
        await archiveExpiredChallenges(); 
        
        // 3. Run the Daily User Tick (Updates active day counters)
        await processDailyUserTick(currentStreamDay);
        
        // 4. Increment the global stream day counter to advance the clock for tomorrow's tick.
        // This is necessary to ensure the clock advances even if no stream event occurs that day.
        await incrementGlobalDayStat(); 
        
        console.log(`[Scheduler] Daily Tick Complete. Global Day advanced.`);

    } catch (error) {
        console.error('[Scheduler Error] Daily Tick failed:', error);
    }

}, {
    timezone: "UTC"
});


// --- Start the server Function ---
/**
 * Executes state initialization and starts the HTTP listener.
 */
async function startServer() {
  // 🚨 State Initialization: Must run and await before the server listens for requests.
  await initializeStreamState(); 

  // --- Start the server ---
  app.listen(PORT, () => {
    console.log(`\n🚀 Drummer Manager API is live at http://localhost:${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Call the async function to begin the startup sequence.
startServer();