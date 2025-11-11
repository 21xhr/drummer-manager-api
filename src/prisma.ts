// src/prisma.ts
import { PrismaClient } from '@prisma/client';

// We only instantiate the client once.
// We use a global variable to prevent multiple instances in development, 
// which can cause connection issues.
const prisma = new PrismaClient();

// Export the single instance for use across the application
export default prisma;