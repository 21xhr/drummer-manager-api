// src/utils/jwtUtils.ts

/**
 * Parses a duration string (e.g., '15m', '2h') and returns the total minutes, 
 * without applying any maximum cap.
 * @param duration The raw duration string.
 * @returns The duration in minutes, or 0 if invalid.
 */
export function convertDurationToMinutes(duration: string | undefined): number {
    if (!duration) return 0;
    
    // Matches e.g., '15m', '30M', '1h', '2H'
    const match = duration.match(/^(\d+)([mh])$/i); 
    if (!match) return 0;

    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    // Convert everything to minutes
    if (unit === 'h') {
        return value * 60;
    } else { // unit === 'm'
        return value;
    }
}