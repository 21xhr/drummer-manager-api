// src/routes/userRoutes.ts
//dedicated router file to hold all your API routes, keeping src/index.ts clean.
import { Router } from 'express';
import { findOrCreateUser } from '../services/userService';

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


export default router;