// src/logger.ts
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, errors, json } = format; // <-- ADD 'json'

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
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', 
  
  format: combine(
    errors({ stack: true }), 
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    
    // Choose format based on environment:
    process.env.NODE_ENV !== 'production' 
      ? combine(colorize(), logFormat) // Colorized console output for dev
      : json(), // JSON format for structured, searchable production logs
  ),
  
  transports: [
    new transports.Console(),
    
    // Optional file transports...
  ],
});

export default logger;