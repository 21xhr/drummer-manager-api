// src/index.ts (Updated to include streamRoutes)
import 'express-async-errors'; 
import express, { Request, Response } from 'express';
import prisma from './prisma'; 
import userRoutes from './routes/userRoutes'; 
import streamRoutes from './routes/streamRoutes'; // <--- NEW IMPORT

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Application Routers (All game logic lives here)
app.use('/api/v1/user', userRoutes); 
app.use('/api/v1/stream', streamRoutes); // <--- NEW: Mount stream routes for webhooks

// Basic Health Check Route (Moved to the end)
app.get('/', async (req: Request, res: Response) => {
  // ... (rest of the health check logic remains the same)
  try {
    await prisma.$connect();
    res.status(200).json({
      message: "Drummer Manager API is running successfully!",
      status: "OK",
      dbStatus: "Connected to Supabase",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // ... (error handling remains the same)
    res.status(500).json({
      message: "Drummer Manager API is running, but database connection failed.",
      status: "ERROR",
      dbStatus: "Failed to connect",
      timestamp: new Date().toISOString()
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n🚀 Drummer Manager API is live at http://localhost:${PORT}`);
  console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
});