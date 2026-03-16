// src/shared/database/index.ts

import prisma from "../../config/prisma";
import { logger } from "../utils/logger";

export const db = prisma;

export async function connectDB(): Promise<void> {
  await db.$connect();
  logger.info("Database connected");
}

export async function disconnectDB(): Promise<void> {
  await db.$disconnect();
  logger.info("Database disconnected");
}