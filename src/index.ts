// src/index.ts
/// <reference path="./types/express.d.ts" />
// This file sets up and starts the core web server (API) and the daily scheduler.

// Enables graceful error handling for async routes, 
// preventing the application from crashing on unhandled async exceptions.
import 'express-async-errors'; 
import express, { Request, Response } from 'express';

import cors from 'cors';

import prisma from './prisma'; 
import clockRoutes from './routes/clockRoutes';
import gamemasterRoutes from './routes/gamemasterRoutes';
import streamRoutes from './routes/streamRoutes';
import tokenRoutes from './routes/tokenRoutes';
import userRoutes from './routes/userRoutes'; 

import { initializeStreamState } from './services/streamService'; 


// --- Server Setup ---
const app = express();
// ⭐ Ensure PORT is always a number by casting the entire expression.
const PORT = Number(process.env.PORT || 3000);

// --- Middleware ---
// ⭐ Define the allowed origins for CORS (Used for production reference)
const PROD_ORIGIN = "https://drummer-manager-website.vercel.app";
// Note: DEV_ORIGINS is only used for logging/debugging context now, the main rule is below.
const DEV_ORIGINS = [
    "http://localhost:3001",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://192.168.1.37:*"
];


// ⭐ CORS Configuration (Must come before app.use(express.json()))
const corsOptions = {
    // CRITICAL FIX: Use a custom function to allow ALL requests in development 
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
    credentials: true,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions)); // ⭐ Apply CORS Middleware
app.use(express.json());

// --- Application Routers (API Endpoints) ---
app.use('/api/v1/clock', clockRoutes);
app.use('/api/gamemaster', gamemasterRoutes); // <-- ADD THIS LINE
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
    // 🚨 State Initialization: Must run and await before the server listens for requests.
    await initializeStreamState(); 
  } catch (error) {
    // CRITICAL: Log the specific initialization failure
    console.error("CRITICAL ERROR: Failed during application state initialization (initializeStreamState). Server cannot start.", error);
    // You may want to exit the process here, but logging is the priority for Vercel
  }

  // --- Start the server ---
  // ⭐ CRITICAL: Add the host 0.0.0.0 to bind to all interfaces
  const HOST = '0.0.0.0';

  // --- Start the server ---
  // FIX 2: This call is now valid because PORT is guaranteed to be a number.
  app.listen(PORT, HOST, () => {
    // The console message can now use the HOST to show network accessibility
    console.log(`\n🚀 Drummer Manager API is live and network accessible at http://${HOST}:${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
  });
}


// Call the async function to begin the startup sequence.
startServer();