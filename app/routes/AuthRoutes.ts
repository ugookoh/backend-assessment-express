import express from "express";
import { AuthController } from "../controller";
import { validateRequest } from "../middlewares";
import { AuthSchemas } from "../validators";

const router = express.Router();

/**
 * @swagger
 *
 * /auth/signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth]
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                      - email
 *                      - password
 *                      properties:
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid input
 */
router.post(
  "/signup",
  validateRequest(AuthSchemas.authSchema),
  AuthController.signUp
);

/**
 * @swagger
 *
 * /auth/login:
 *   post:
 *     summary: Log into an account
 *     tags: [Auth]
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                      - email
 *                      - password
 *                      properties:
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *     responses:
 *       200:
 *         description: Login succeeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid input
 */
router.post(
  "/login",
  validateRequest(AuthSchemas.authSchema),
  AuthController.login
);

export default router;
