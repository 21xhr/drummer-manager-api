// src/index.ts
import 'express-async-errors'; 
import express, { Request, Response } from 'express';
import prisma from './prisma'; // Import the shared Prisma client

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Basic Health Check Route
app.get('/', async (req: Request, res: Response) => {
  // Test the database connection on health check
  try {
    await prisma.$connect();
    res.status(200).json({
      message: "Drummer Manager API is running successfully!",
      status: "OK",
      dbStatus: "Connected to Supabase",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database connection failed:", error);
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