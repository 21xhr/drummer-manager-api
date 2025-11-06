// src/logger.ts
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, errors } = format;

// Define the custom format for our logs
const logFormat = printf(({ level, message, timestamp, stack }) => {
  // If a stack trace is present (usually for errors), include it
  if (stack) {
    return `${timestamp} [${level}]: ${message}\n${stack}`;
  }
  return `${timestamp} [${level}]: ${message}`;
});

// Create the logger instance
const logger = createLogger({
  // Only log messages with this level or higher (error > warn > info > verbose > debug > silly)
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', 
  
  format: combine(
    // 1. Ensure stack traces are captured for Error objects
    errors({ stack: true }), 
    // 2. Add timestamp
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    // 3. Define the output color and format
    process.env.NODE_ENV !== 'production' ? colorize() : format.uncolorize(),
    logFormat
  ),
  
  transports: [
    // Send logs to the console
    new transports.Console(),
    
    // Optional: Add a file transport for persistent storage (uncomment if needed)
    /*
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
    */
  ],
});

export default logger;