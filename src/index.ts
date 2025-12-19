// src/index.ts
// This file sets up and starts the core web server (API) and the daily scheduler.

// Enables graceful error handling for async routes, 
// preventing the application from crashing on unhandled async exceptions.
import 'express-async-errors'; 
import express, { Request, Response } from 'express';

// ----------------------------------------------------------------------
// GLOBAL BIGINT SERIALIZATION
// ----------------------------------------------------------------------
// Fixes the "Do not know how to serialize a BigInt" error thrown by Express/JSON.stringify
// when data from Prisma/database is sent to the client.
(BigInt.prototype as any).toJSON = function() {
    // Converts BigInts to Strings for safe transport via JSON.
    return this.toString(); 
};
// ----------------------------------------------------------------------

import cors from 'cors';

import prisma from './prisma'; 
import adminRoutes from './routes/adminRoutes';
import clockRoutes from './routes/clockRoutes';
import gamemasterRoutes from './routes/gamemasterRoutes';
import streamRoutes from './routes/streamRoutes';
import tokenRoutes from './routes/tokenRoutes';
import userRoutes from './routes/userRoutes'; 

import { initializeConsoleSubscribers } from './eventSubscribers/consoleLogger';
import { initializeNotificationService } from './eventSubscribers/notificationService'; 
import { initializeStreamState } from './services/streamService'; 
import { startChallengeScheduler } from './scheduler'; 

// --- Server Setup ---
const app = express();
// Ensure PORT is always a number by casting the entire expression.
const PORT = Number(process.env.PORT || 3000);

// --- Middleware ---
// Define the allowed origins for CORS (Used for production reference)
const PROD_ORIGIN = "https://drummer-manager-website.vercel.app";
// Note: DEV_ORIGINS is only used for logging/debugging context now, the main rule is below.
const DEV_ORIGINS = [
    "http://localhost:3001",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://192.168.1.37:*"
];

// CORS Configuration (Must come before app.use(express.json()))
const corsOptions = {
    // CRITICAL: Use a custom function to allow ALL requests in development 
    // that are NOT production, bypassing all local network header issues.
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        const isProduction = process.env.NODE_ENV === 'production';
        
        if (isProduction) {
            // In Production, lock it down to the Vercel URL
            if (origin === PROD_ORIGIN) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'), false);
            }
        } else {
            // In Development, allow any origin. This is the only reliable way 
            // to allow external clients (phone) to connect to your private IP.
            callback(null, true);
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'X-Admin-Secret'], 
    credentials: true,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions)); // Apply CORS Middleware
app.use(express.json());

// --- Application Routers (API Endpoints) ---
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/clock', clockRoutes);
app.use('/api/v1/gamemaster', gamemasterRoutes);
app.use('/api/v1/stream', streamRoutes);
app.use('/api/v1/token', tokenRoutes);
app.use('/api/v1/user', userRoutes); 

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
    // 🚨 State Initialization: Must run and await before the server starts & listens for requests.
    await initializeStreamState(); 
    startChallengeScheduler();
    initializeConsoleSubscribers();
    initializeNotificationService();
    
  } catch (error) {
    console.error("CRITICAL ERROR: Failed during application state initialization (initializeStreamState). Server cannot start.", error);
    process.exit(1);
  }

  // --- Start the server ---
  const HOST = '0.0.0.0'; // To bind to all interfaces

  // --- Start the server ---
  app.listen(PORT, HOST, () => {
    console.log(`\n🚀 Drummer Manager API is live and network accessible at http://${HOST}:${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
  });
}


// Call the async function to begin the startup sequence.
startServer();