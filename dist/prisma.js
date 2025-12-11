"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/prisma.ts
const client_1 = require("@prisma/client");
// We only instantiate the client once.
// We use a global variable to prevent multiple instances in development, 
// which can cause connection issues.
const prisma = new client_1.PrismaClient();
// Export the single instance for use across the application
exports.default = prisma;
