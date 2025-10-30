// src/routes/userRoutes.ts
import { Router } from 'express'; // <-- Ensure Router is in curly braces { }
import { findOrCreateUser } from '../services/userService';
import { processDigout } from '../services/challengeService';

const router = Router();



// -----------------------------------------------------------
// NOTE: This is a placeholder for a generic command processing route.
// In a real scenario, you'd have specific endpoints for !push, !digout, etc.
// We're using a generic /user/process route to test the core logic.
// -----------------------------------------------------------

/**
 * POST /api/v1/user/process
 * Simulates receiving data from an external platform (Lumia Stream, Chatbot)
 * to process a command that requires a database user record.
 *
 * Request Body Example:
 * {
 * "platformId": "twitch-user-12345",
 * "platformName": "Twitch",
 * "command": "!mystats",
 * "args": []
 * }
 */
router.post('/process', async (req, res) => {
  const { platformId, platformName, command, args } = req.body;

  if (!platformId || !platformName) {
    return res.status(400).json({ error: "Missing platformId or platformName in request." });
  }

  // 1. Find or Create the User (Core Logic Test)
  const user = await findOrCreateUser({ platformId, platformName });

  // 2. Respond with the user data and simulated command context
  return res.status(200).json({
    message: `User record for ${user.platformName} user ${user.platformId} successfully processed.`,
    action: `Ready to execute command: ${command}`,
    userData: {
      dbId: user.id,
      platformId: user.platformId,
      lastActivity: user.lastActivityTimestamp
    }
  });
});




// -----------------------------------------------------------
// CORE GAME COMMANDS
// -----------------------------------------------------------

/**
 * POST /api/v1/user/digout
 * Handles the execution of the !digout [ID] command.
 * Request Body: { platformId: string, platformName: string, targetId: number }
 */
router.post('/digout', async (req, res) => {
  const { platformId, platformName, targetId } = req.body;

  if (!platformId || !platformName || typeof targetId !== 'number') {
    return res.status(400).json({ error: "Missing platformId, platformName, or targetId (Challenge ID)." });
  }

  // 1. Ensure the User exists in the database
  const user = await findOrCreateUser({ platformId, platformName });

  try {
    // 2. Execute the !digout business logic
    const { updatedChallenge, cost } = await processDigout(user.id, targetId);

    // 3. Success Response
    return res.status(200).json({
      message: `Challenge #${updatedChallenge.challengeId} was successfully dug out!`,
      action: 'digout_success',
      details: {
        challengeId: updatedChallenge.challengeId,
        status: updatedChallenge.status,
        cost: cost,
        totalNumbersSpentGameWide: (user.totalNumbersSpentGameWide + cost) // MOCK: this is not perfect as user is not updated here, but sufficient for now
      }
    });
  } catch (error) {
    // 4. Error Response (based on error thrown by the service)
    return res.status(400).json({
      message: 'Digout failed.',
      error: error instanceof Error ? error.message : 'An unknown error occurred.',
      action: 'digout_failure',
    });
  }
});

/**
 * POST /api/v1/user/push
 * Handles the first stage of the !push [ID] [quantity] command: generating a quote.
 * Request Body: { platformId: string, platformName: string, targetId: number, quantity: number }
 */
router.post('/push', async (req, res) => {
  const { platformId, platformName, targetId, quantity } = req.body;

  if (!platformId || !platformName || typeof targetId !== 'number' || typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ error: "Missing platformId, platformName, targetId (Challenge ID), or invalid quantity." });
  }

  const user = await findOrCreateUser({ platformId, platformName });

  try {
    // 2. Execute the !push quote logic
    const { quoteId, quotedCost, challenge } = await processPushQuote(user.id, targetId, quantity);

    // 3. Success Response: Tell the user the cost and how to confirm
    return res.status(200).json({
      message: `Push quote generated for Challenge #${challenge.challengeId}.`,
      action: 'push_quote_success',
      details: {
        quoteId: quoteId,
        quotedCost: quotedCost,
        targetChallenge: challenge.challengeText,
        confirmationCommand: `!push confirm ${quoteId}`,
        // NOTE: The Lumia API would handle sending this message to the chat.
      }
    });
  } catch (error) {
    // 4. Error Response
    return res.status(400).json({
      message: 'Push quote failed.',
      error: error instanceof Error ? error.message : 'An unknown error occurred.',
      action: 'push_quote_failure',
    });
  }
});

export default router;