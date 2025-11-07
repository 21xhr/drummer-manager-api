// src/index.ts
// This file sets up and starts the core web server (API).

// Enables graceful error handling for async routes, 
// preventing the application from crashing on unhandled async exceptions.
import 'express-async-errors'; 
import express, { Request, Response } from 'express';
// Prisma client is the connection to our database (Supabase).
import prisma from './prisma'; 

// Import the specific route files for different parts of the application.
import userRoutes from './routes/userRoutes'; 
import streamRoutes from './routes/streamRoutes';

// Initialize Stream State once when the API server process starts.
import { initializeStreamState } from './services/streamService'; // <-- REQUIRED IMPORT

// --- Server Setup ---
const app = express();
const PORT = process.env.PORT || 3000; // Use port 3000 unless a different one is specified in the environment.

// --- Middleware ---
// Enables the server to read incoming JSON data in request bodies (e.g., POST and PUT requests).
app.use(express.json());

// --- Application Routers (API Endpoints) ---
// These lines map specific URL paths to our route handlers.
// All user commands (submit, push, digout, disrupt) are accessed via /api/v1/user/...
app.use('/api/v1/user', userRoutes); 
// Routes for stream-related actions (e.g., going live/offline, stream metrics).
app.use('/api/v1/stream', streamRoutes);

// --- Basic Health Check Route ---
// A simple test route to check if the server and database are running correctly.
app.get('/', async (req: Request, res: Response) => {
  try {
    // Attempt to connect to the database to ensure the connection is active.
    await prisma.$connect();
    res.status(200).json({
      message: "Drummer Manager API is running successfully!",
      status: "OK",
      dbStatus: "Connected to Supabase", // Confirms DB connection status
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // If the database connection fails, report an error (but the server itself is running).
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
 * Executes state initialization before starting the HTTP listener.
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