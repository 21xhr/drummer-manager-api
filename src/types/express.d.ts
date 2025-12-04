// src/types/express.d.ts

// 1. Import the necessary type from Prisma Client
import { PlatformName } from '@prisma/client'; 

// 2. Use module augmentation to correctly extend the Express Request interface
declare module 'express-serve-static-core' {
    // We merge with the core Request interface that Express uses
    interface Request {
        // Properties added by authenticateUser middleware
        userId: number;
        platformId: string;
        platformName: PlatformName; 
    }
}