// src/utils/routeUtils.ts

/**
 * Maps service error messages to appropriate HTTP status codes.
 */
export function getServiceErrorStatus(errorMessage: string): number {
    // 400 Bad Request (Client did something wrong: not found, invalid state, insufficient balance)
    if (
        errorMessage.includes("Challenge ID") || 
        errorMessage.includes("not found") || 
        errorMessage.includes("Status is") ||
        errorMessage.includes("cannot be executed. Status must be 'Active'") ||
        errorMessage.includes("Insufficient balance") || 
        errorMessage.includes("Quote has expired") || 
        errorMessage.includes("Multiple active quotes") ||
        errorMessage.includes("cannot be dug out") ||
        errorMessage.includes("already been digged out") ||
        errorMessage.includes("currently being processed")
    ) {
        return 400;
    }
    
    // 403 Forbidden (Unauthorized action)
    if (
        errorMessage.includes("only be removed by the author") || 
        errorMessage.includes("cannot be removed while in status") ||
        // Catch generic unauthorized/access denied messages (e.g., from execute endpoint)
        errorMessage.includes("Access Denied") || 
        errorMessage.includes("unauthorized")
    ) {
         return 403;
    }
    
    // 500 Internal Server Error (Something unexpected happened)
    return 500;
}