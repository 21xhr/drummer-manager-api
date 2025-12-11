"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/logger.ts
const winston_1 = require("winston");
const { combine, timestamp, printf, colorize, errors, json } = winston_1.format; // <-- ADD 'json'
// Define the custom format for our logs (Console Output)
const logFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    // If a stack trace is present (usually for errors), include it
    if (stack) {
        msg += `\n${stack}`;
    }
    // If extra metadata exists (e.g., command, userId), append it for console readability
    if (Object.keys(metadata).length > 0) {
        // Exclude the 'level', 'timestamp' keys added by winston
        const printableMetadata = JSON.stringify(metadata, null, 2);
        msg += `\n${printableMetadata}`;
    }
    return msg;
});
// Create the logger instance
const logger = (0, winston_1.createLogger)({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
    // Choose format based on environment:
    process.env.NODE_ENV !== 'production'
        ? combine(colorize(), logFormat) // Colorized console output for dev
        : json()),
    transports: [
        new winston_1.transports.Console(),
        // Optional file transports...
    ],
});
exports.default = logger;
