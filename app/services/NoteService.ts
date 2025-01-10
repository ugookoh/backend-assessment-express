import {
  NoteRepository,
  SharedNoteRepository,
  KeywordToNoteRepository,
} from "../repositories";
import { UserService } from ".";
import { KeywordToNote, Note, SharedNote } from "../entities";
import { Like } from "typeorm";

export const getNotes = async (userId: number) => {
  const user = await UserService.getUserById(userId);
  return user?.notes || [];
};

export const getNoteById = async (userId: number, noteId: number) => {
  const note = await NoteRepository.findOne({
    where: { id: noteId },
    relations: ["user"],
  });
  if (!note) {
    throw new Error("This note does not exist");
  }
  if (note.user.id !== userId) {
    const sharedNote = await SharedNoteRepository.findBy({
      id: `${noteId}-${userId}`,
    });
    if (sharedNote.length == 0) {
      throw new Error("This user is not authorized to view this note");
    }
  }

  return { id: note.id, content: note.content, keywords: note.keywords };
};

export const createNote = async (
  userId: number,
  note: string,
  keywords: string[]
) => {
  const user = await UserService.getUserById(userId);
  keywords = [...new Set(keywords)];
  let createdNote = new Note(note, user, keywords);

  createdNote = await NoteRepository.save(createdNote);

  const keywordToNotes: KeywordToNote[] = [];
  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i];
    keywordToNotes.push(new KeywordToNote(createdNote, keyword, userId));
  }
  if (keywordToNotes.length > 0) {
    await KeywordToNoteRepository.save(keywordToNotes);
  }

  return {
    id: createdNote.id,
    content: createdNote.content,
    keywords: createdNote.keywords,
  };
};

export const updateNote = async (
  userId: number,
  noteId: number,
  content: string
) => {
  const note = await NoteRepository.findOne({
    where: { id: noteId },
    relations: ["user"],
  });

  if (!note) {
    throw new Error("This note does not exist");
  } else if (note.user.id !== userId) {
    throw new Error("This user cannot update this note");
  }

  await NoteRepository.update(noteId, { content });

  return { id: note.id, keywords: note.keywords, content };
};

export const deleteNote = async (userId: number, noteId: number) => {
  const note = await NoteRepository.findOne({
    where: { id: noteId },
    relations: ["user"],
  });

  if (!note) {
    throw new Error("This note does not exist");
  } else if (note.user.id !== userId) {
    throw new Error("This user cannot delete this note");
  }

  await KeywordToNoteRepository.delete({ note });
  await NoteRepository.delete(noteId);
  await SharedNoteRepository.delete({ noteId });

  return { id: note.id, keywords: note.keywords, content: note.content };
};

export const shareNote = async (
  ownerUserId: number,
  sharedUserId: number,
  noteId: number
) => {
  if (ownerUserId === sharedUserId) {
    throw new Error("You cannot share a note with yourself");
  }
  const note = await NoteRepository.findOne({
    where: { id: noteId },
    relations: ["user"],
  });
  await UserService.getUserById(sharedUserId);

  if (!note) {
    throw new Error("This note does not exist");
  } else if (note.user.id !== ownerUserId) {
    throw new Error("This user cannot share this note");
  }

  const sharedNote = new SharedNote(noteId, sharedUserId);

  await SharedNoteRepository.save(sharedNote);

  return { id: note.id, keywords: note.keywords, content: note.content };
};

export const searchNote = async (query: string, userId: number) => {
  if (query.length < 3) {
    return [];
  }

  const notes = await KeywordToNoteRepository.find({
    where: {
      keyword: Like(`%${query.toLowerCase()}%`),
      userId: userId,
    },
    relations: ["note"],
    select: ["note"],
  });

  const uniqueNotes = Array.from(
    new Set(notes.map((note) => note.note.id))
  ).map((id) => notes.find((note) => note.note.id === id)!.note);

  return uniqueNotes as any as Note[];
};
