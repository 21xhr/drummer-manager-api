// src/types/express.d.ts

// This file extends the Express Request type to include custom properties
// attached by your middleware (like authenticateUser).

declare namespace Express {
    // Merge the interface with the existing Express Request interface
    export interface Request {
        // Properties added by authenticateUser middleware
        userId: number;
        platformId: string;
        platformName: string;
    }
}