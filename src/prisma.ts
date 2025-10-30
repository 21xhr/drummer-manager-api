// src/prisma.ts
import { PrismaClient } from '@prisma/client';
import 'dotenv/config'; // Ensure .env is loaded for the DATABASE_URL

// Instantiate PrismaClient
const prisma = new PrismaClient();

// Export the single instance for use across the application
export default prisma;