import express from "express";
import { NoteController } from "../controller";
import {
  validateRequest,
  validateQuery,
  authenticateToken,
} from "../middlewares";
import { NoteSchemas } from "../validators";

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /notes:
 *   get:
 *     summary: Retrieve all notes for a particular user
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   content:
 *                     type: string
 *                   keywords:
 *                     type: array
 *                     items:
 *                       type: string
 */
router.get("/", authenticateToken, NoteController.getNotes);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /notes/search:
 *   get:
 *     summary: Search for a note
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: q
 *         in: query
 *         description: Query string to search for in notes
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   content:
 *                     type: string
 *                   keywords:
 *                     type: array
 *                     items:
 *                       type: string
 */
router.get("/search", authenticateToken, NoteController.searchNote);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /notes/{id}:
 *   get:
 *     summary: Retrieve a note by ID
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the note to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results for notes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 content:
 *                   type: string
 *                 keywords:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Note not found
 */
router.get(
  "/:id",
  validateQuery(NoteSchemas.getNoteByIdQuery),
  authenticateToken,
  NoteController.getNoteById
);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                      - content
 *                      - keywords
 *                      properties:
 *                          content:
 *                              type: string
 *                          keywords:
 *                              type: array
 *                              items: 
 *                                  type: string
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 content:
 *                   type: string
 *                 keywords:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Invalid input
 */
router.post(
  "/",
  validateRequest(NoteSchemas.createNoteBody),
  authenticateToken,
  NoteController.createNote
);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /notes:
 *   put:
 *     summary: Update an existing note
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                      - content
 *                      - noteId
 *                      properties:
 *                          content:
 *                              type: string
 *                          noteId:
 *                              type: number
 *     responses:
 *       200:
 *         description: Note successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 content:
 *                   type: string
 *                 keywords:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Invalid input
 */
router.put(
  "/",
  validateRequest(NoteSchemas.updateNoteBody),
  authenticateToken,
  NoteController.updateNote
);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /notes:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                      - content
 *                      properties:
 *                          noteId:
 *                              type: number
 *     responses:
 *       200:
 *         description: Note successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 content:
 *                   type: string
 *                 keywords:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Invalid input
 */
router.delete(
  "/",
  validateRequest(NoteSchemas.deleteNoteBody),
  authenticateToken,
  NoteController.deleteNote
);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /notes/share:
 *   post:
 *     summary: Share a note with another user
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                      - sharedUserId
 *                      - noteId
 *                      properties:
 *                          sharedUserId:
 *                              type: number
 *                          noteId:
 *                              type: number
 *     responses:
 *       200:
 *         description: Note shared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 content:
 *                   type: string
 *                 keywords:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Invalid input
 */
router.post(
  "/share",
  validateRequest(NoteSchemas.shareNoteBody),
  authenticateToken,
  NoteController.shareNote
);

export default router;
