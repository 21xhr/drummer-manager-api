// src/index.ts
// This file sets up and starts the core web server (API) and the daily scheduler.

// Enables graceful error handling for async routes, 
// preventing the application from crashing on unhandled async exceptions.
import 'express-async-errors'; 
import express, { Request, Response } from 'express';

import prisma from './prisma'; 
import userRoutes from './routes/userRoutes'; 
import streamRoutes from './routes/streamRoutes';
import clockRoutes from './routes/clockRoutes';
import tokenRoutes from './routes/tokenRoutes';

import { initializeStreamState, getCurrentStreamDay } from './services/streamService'; 
import { archiveExpiredChallenges } from './services/challengeService';
import { processDailyUserTick } from './services/clockService'; 

import { incrementGlobalDayStat } from './services/streamService'; 


// --- Server Setup ---
const app = express();
const PORT = process.env.PORT || 3000; 

// --- Middleware ---
app.use(express.json());

// --- Application Routers (API Endpoints) ---
app.use('/api/v1/user', userRoutes); 
app.use('/api/v1/stream', streamRoutes);
app.use('/api/v1/clock', clockRoutes);
app.use('/api/v1/token', tokenRoutes);

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


// --- Start the server Function ---
/**
 * Executes state initialization and starts the HTTP listener.
 */
async function startServer() {
  
  try {
    // 🚨 State Initialization: Must run and await before the server listens for requests.
    await initializeStreamState(); 
  } catch (error) {
    // CRITICAL: Log the specific initialization failure
    console.error("CRITICAL ERROR: Failed during application state initialization (initializeStreamState). Server cannot start.", error);
    // You may want to exit the process here, but logging is the priority for Vercel
  }

  // --- Start the server ---
  app.listen(PORT, () => {
    console.log(`\n🚀 Drummer Manager API is live at http://localhost:${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
  });
}


// Call the async function to begin the startup sequence.
startServer();
// Dummy commit to bust Vercel cache: v1.0