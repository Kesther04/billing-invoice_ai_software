// src/modules/clients/client.routes.ts

import { Router } from "express";
import {
  createClientHandler,
  getClientHandler,
  listClientsHandler,
  updateClientHandler,
  deleteClientHandler,
} from "./client.controller";
import { requireAuth } from "../users/jwt.strategy";

const router = Router();

router.use(requireAuth);

/**
 * @route   POST /clients
 * @desc    Create a client under the authenticated user's organization
 * @access  Private
 */
router.post("/", createClientHandler);

/**
 * @route   GET /clients
 * @desc    List clients for the organization, with search, status filter, and pagination
 * @access  Private
 */
router.get("/", listClientsHandler);

/**
 * @route   GET /clients/:id
 * @desc    Get a single client by id
 * @access  Private
 */
router.get("/:id", getClientHandler);

/**
 * @route   PATCH /clients/:id
 * @desc    Update a client
 * @access  Private
 */
router.patch("/:id", updateClientHandler);

/**
 * @route   DELETE /clients/:id
 * @desc    Delete a client (blocked if invoices exist against it)
 * @access  Private
 */
router.delete("/:id", deleteClientHandler);

export default router;