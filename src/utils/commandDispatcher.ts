// drummer-manager-api/src/utils/commandDispatcher.ts
/**
 * Handles chat/bot commands (e.g., !submit challenge). 
 * Responsible for parsing a command string into a standard JSON payload 
 * before sending it to the service.
*/

import logger from '../logger';
import * as userService from '../services/userService';
import * as challengeService from '../services/challengeService'; // Now imports all your logic
import { PlatformName } from '@prisma/client'; 

// Define the structure of the data expected from the external system (Lumia Stream)
interface CommandPayload {
    command: string; // e.g., "!push", "!challengesubmit"
    user: {
        userId: string;       // Unique platform ID (immutable)
        username: string;     // The user's login / channel name
        displayname?: string; // The display name
    };
    platform: {
        name: string; // e.g., "TWITCH"
    };
    // Generic arguments field (e.g., "121 5" for !push 121 5)
    args: string | null; 
}

/**
 * Parses space-separated arguments from the args string.
 * @param argsString - The raw argument string.
 * @returns An array of trimmed strings.
 */
function parseArgs(argsString: string | null): string[] {
    if (!argsString) return [];
    // Split by spaces, filter out empty strings, and trim whitespace
    return argsString.trim().split(/\s+/).filter(s => s.length > 0);
}


/**
 * Maps the incoming command string to the correct business logic handler.
 * User resolution is handled by the upstream Express middleware (authenticateUser).
 */
export async function dispatchCommand(
    dbUserId: number, // <-- The resolved database User ID
    payload: CommandPayload, 
    hostname: string
) {
    const { command, user, platform, args } = payload;
    const fullCommand = `${command}${args ? ' ' + args : ''}`;
    const parsedArgs = parseArgs(args);
    
    // We rely on the CommandPayload to provide the platform context for transactional calls.
    const platformId: string = user.userId;
    const platformName: PlatformName = platform.name as PlatformName;
    const usernameToStore: string = user.displayname || user.username || platformId;

    try {
        // MANDATORY STEP 1: User resolution is now handled upstream.
        // We log using the resolved ID.

        logger.info(`Dispatching API command`, {
            userId: dbUserId, // Use the resolved ID
            platformId: platformId,
            fullCommand: fullCommand,
            context: 'DISPATCHER_START'
        });

        // ------------------------------------------------------------------
        // MANDATORY STEP 2: DISPATCH LOGIC
        // ------------------------------------------------------------------
        
        // ------------------------------------------------------------------
        // Match multi-word commands (e.g., !push confirm)
        // ------------------------------------------------------------------
        if (command.startsWith('!push')) {
            const firstArg = parsedArgs[0]?.toLowerCase();
            
            if (firstArg === 'confirm') {
                // COMMAND: !push confirm [optional quoteId]
                const quoteId = parsedArgs[1]; // quoteId is optional
                
                const result = await challengeService.processPushConfirm(
                    dbUserId, 
                    platformId, 
                    platformName, 
                    quoteId
                );
                return {
                    message: `✅ Pushed ${result.quantity}x to Challenge #${result.updatedChallenge.challengeId}! Cost: ${result.transactionCost} NUMBERS.`
                };
            }

            // COMMAND: !push [ID] [quantity] (Quote Request)
            const challengeId = parseInt(parsedArgs[0]);
            const quantity = parseInt(parsedArgs[1]);

            if (isNaN(challengeId) || isNaN(quantity) || challengeId <= 0 || quantity <= 0) {
                 return {
                    message: `Invalid !push format. Use: !push [Challenge ID] [Quantity]. Example: !push 121 5`
                };
            }
            
            const result = await challengeService.processPushQuote(
                dbUserId, 
                platformId, 
                platformName, 
                challengeId, 
                quantity
            );
            
            return {
                message: `[PUSH QUOTE] Challenge #${challengeId}: Pushing ${quantity}x will cost ${result.quotedCost} NUMBERS. Confirm with **!push confirm** within 30 seconds.`
            };
        } 
        
        // ------------------------------------------------------------------
        // Match standard single-step commands
        // ------------------------------------------------------------------
        switch (command) {
            case '!challengesubmit':
                // COMMAND: !challengesubmit [duration]
                // Note: The duration argument is args[0]
                const durationArg = parsedArgs[0];
                
                const linkResult = await challengeService.processSubmissionLinkGeneration(
                    dbUserId, 
                    platformId,
                    platformName, 
                    usernameToStore,
                    durationArg,
                    hostname // Pass hostname for URL construction
                );
                
                logger.info('Challenge submission link generated.', linkResult.details);

                return {
                    message: linkResult.chatResponse,
                    action: 'submission_link_generated'
                };
            
            case '!digout':
                // COMMAND: !digout [ID]
                const digoutChallengeId = parseInt(parsedArgs[0]);

                if (isNaN(digoutChallengeId) || digoutChallengeId <= 0) {
                     return {
                        message: `Invalid !digout format. Use: !digout [Challenge ID]. Example: !digout 42`
                    };
                }

                const digoutResult = await challengeService.processDigout(
                    dbUserId, 
                    platformId, 
                    platformName, 
                    digoutChallengeId
                );
                
                return {
                    message: `⛏️ Challenge #${digoutChallengeId} was successfully Dug Out! Status reset to ACTIVE. Cost: ${digoutResult.cost} NUMBERS.`
                };
            
            case '!remove':
                // COMMAND: !remove [ID] [option]
                const removeChallengeId = parseInt(parsedArgs[0]);
                // Default option is 'community_forfeit' if not specified
                const removeOption = (parsedArgs[1]?.toLowerCase() || 'community_forfeit') as challengeService.RefundOption;
                
                if (isNaN(removeChallengeId) || removeChallengeId <= 0) {
                     return {
                        message: `Invalid !remove format. Use: !remove [Challenge ID] [option]. Options: 'community_forfeit', 'author_and_chest', 'author_and_pushers'.`
                    };
                }
                
                const removeResult = await challengeService.processRemove(dbUserId, removeChallengeId, removeOption);
                
                let removeMessage = `🗑️ Challenge #${removeChallengeId} removed by author. A total of ${removeResult.totalRefundsAmount} NUMBERS (21%) was refunded.`;
                if (removeResult.fundsSink === 'Community Chest') {
                    removeMessage += ` All refunds (${removeResult.totalRefundsAmount} NUMBERS) were forfeited to the Community Chest.`;
                } else {
                    removeMessage += ` Distribution: ${removeResult.toAuthor} to Author, ${removeResult.toCommunityChest > 0 ? removeResult.toCommunityChest + ' to Chest, ' : ''} ${removeResult.toExternalPushers} to Pushers.`;
                }
                
                return { message: removeMessage };

            case '!disrupt':
                // COMMAND: !disrupt
                const disruptMessage = await challengeService.processDisrupt(
                    dbUserId, 
                    platformId, 
                    platformName
                );
                return { message: disruptMessage };
            
            case '!qlogic':
                return {
                    message: `The cost is quadratic, which means strategic influence is EXPENSIVE. It applies to !challengesubmit (daily reset) and !push (never resets).`
                };
            
            case '!mystats':
                // COMMAND: !mystats
                const statsMessage = await userService.processUserStats(dbUserId);
                return {
                    message: statsMessage
                };

            default:
                // Handle unknown commands gracefully
                return {
                    message: `Unknown command: ${command}. Please check spelling or use !help.`
                };
        }
        
    } catch (error) {
        // Central error handling for any failure in the service layer
        logger.error(`Critical Dispatch Error for command: ${fullCommand}`, {
            userId: dbUserId || 'N/A',
            platformId: user.userId, // This is the unique platform ID from Lumia
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            context: 'DISPATCHER_ERROR'
        });

        // Return a generic error message to the user, using the specific error message if it's a game-logic error
        const userFriendlyError = error instanceof Error ? error.message : 'A server error occurred while processing your command.';
        
        return {
            message: `⛔ ERROR: ${userFriendlyError}`,
            errorDetail: error instanceof Error ? error.stack : undefined
        };
    }
}