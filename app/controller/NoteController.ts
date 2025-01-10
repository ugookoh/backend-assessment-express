import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { NoteService } from "../services";

export const getNotes = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.body.userId);
    const notes = await NoteService.getNotes(userId);
    res.status(StatusCodes.OK).json({ response: notes });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.body.userId);
    const noteId = Number(req.params.id);
    const note = await NoteService.getNoteById(userId, noteId);
    res.status(StatusCodes.OK).json({ response: note });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const createNote = async (req: Request, res: Response) => {
  try {
    const { userId, content, keywords } = req.body;
    const response = await NoteService.createNote(userId, content, keywords);
    res.status(StatusCodes.OK).json({ response });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    const { userId, content, noteId } = req.body;
    const response = await NoteService.updateNote(userId, noteId, content);
    res.status(StatusCodes.OK).json({ response });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { userId, noteId } = req.body;
    const response = await NoteService.deleteNote(userId, noteId);
    res.status(StatusCodes.OK).json({ response });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const shareNote = async (req: Request, res: Response) => {
  try {
    const { sharedUserId, noteId } = req.body;
    const response = await NoteService.shareNote(
      req.body.userId,
      sharedUserId,
      noteId
    );
    res.status(StatusCodes.OK).json({ response });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const searchNote = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const query = (req.query?.q as string) || "";
    const response = await NoteService.searchNote(query, userId);
    res.status(StatusCodes.OK).json({ response });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};
