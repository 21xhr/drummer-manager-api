// src/index.ts
import 'express-async-errors'; // Must be first to wrap all async route handlers
import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Basic Health Check Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: "Drummer Manager API is running successfully!",
    status: "OK",
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n🚀 Drummer Manager API is live at http://localhost:${PORT}`);
  console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
});