// prisma.config.ts
import { defineConfig } from "@prisma/client";
import * as dotenv from 'dotenv'; // Import dotenv

// Load environment variables from .env file
dotenv.config();

// The rest of your Prisma configuration remains empty or uses defaults
export default defineConfig({});