import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  searchNote,
} from "../NoteService";
import { UserService } from "..";
import {
  NoteRepository,
  SharedNoteRepository,
  KeywordToNoteRepository,
} from "../../repositories";
import { Note, SharedNote, KeywordToNote } from "../../entities";

jest.mock("../../repositories");
jest.mock("../UserService");

describe("Note Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getNotes", () => {
    it("should return notes for a user", async () => {
      const mockUser = { id: 1, notes: [{ id: 1, content: "Note 1" }] };
      // @ts-ignore
      UserService.getUserById = jest.fn().mockResolvedValue(mockUser);

      const notes = await getNotes(1);

      expect(UserService.getUserById).toHaveBeenCalledWith(1);
      expect(notes).toEqual(mockUser.notes);
    });

    it("should return an empty array if user has no notes", async () => {
      // @ts-ignore
      UserService.getUserById = jest.fn().mockResolvedValue(null);

      const notes = await getNotes(1);

      expect(notes).toEqual([]);
    });
  });

  describe("getNoteById", () => {
    it("should return a note by its ID", async () => {
      const mockNote = {
        id: 1,
        user: { id: 1 },
        content: "Note content",
        keywords: [],
      };
      NoteRepository.findOne = jest.fn().mockResolvedValue(mockNote);

      const note = await getNoteById(1, 1);

      expect(NoteRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ["user"],
      });
      expect(note).toEqual({ id: 1, content: "Note content", keywords: [] });
    });

    it("should throw an error if the note does not exist", async () => {
      NoteRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(getNoteById(1, 1)).rejects.toThrow(
        "This note does not exist"
      );
    });

    it("should throw an error if user is not authorized to view the note", async () => {
      const mockNote = {
        id: 1,
        user: { id: 2 },
        content: "Note content",
        keywords: [],
      };
      NoteRepository.findOne = jest.fn().mockResolvedValue(mockNote);
      SharedNoteRepository.findBy = jest.fn().mockResolvedValue([]);

      await expect(getNoteById(1, 1)).rejects.toThrow(
        "This user is not authorized to view this note"
      );
    });
  });

  describe("createNote", () => {
    it("should create and return a new note", async () => {
      const mockUser = { id: 1 };
      const mockNote = {
        id: 1,
        content: "Note content",
        keywords: ["keyword1"],
      };
      // @ts-ignore
      UserService.getUserById = jest.fn().mockResolvedValue(mockUser);
      NoteRepository.save = jest.fn().mockResolvedValue(mockNote);

      const result = await createNote(1, "Note content", ["keyword1"]);

      expect(NoteRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockNote);
    });
  });

  describe("updateNote", () => {
    it("should update and return the note", async () => {
      const mockNote = {
        id: 1,
        user: { id: 1 },
        content: "Old content",
        keywords: [],
      };
      NoteRepository.findOne = jest.fn().mockResolvedValue(mockNote);
      NoteRepository.update = jest.fn();

      const result = await updateNote(1, 1, "New content");

      expect(NoteRepository.update).toHaveBeenCalledWith(1, {
        content: "New content",
      });
      expect(result).toEqual({ id: 1, keywords: [], content: "New content" });
    });

    it("should throw an error if the note does not exist", async () => {
      NoteRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(updateNote(1, 1, "New content")).rejects.toThrow(
        "This note does not exist"
      );
    });

    it("should throw an error if user is not authorized to update the note", async () => {
      const mockNote = {
        id: 1,
        user: { id: 2 },
        content: "Old content",
        keywords: [],
      };
      NoteRepository.findOne = jest.fn().mockResolvedValue(mockNote);

      await expect(updateNote(1, 1, "New content")).rejects.toThrow(
        "This user cannot update this note"
      );
    });
  });

  describe("deleteNote", () => {
    it("should delete the note", async () => {
      const mockNote = {
        id: 1,
        user: { id: 1 },
        content: "Note content",
        keywords: [],
      };
      NoteRepository.findOne = jest.fn().mockResolvedValue(mockNote);
      NoteRepository.delete = jest.fn();
      KeywordToNoteRepository.delete = jest.fn();
      SharedNoteRepository.delete = jest.fn();

      const result = await deleteNote(1, 1);

      expect(NoteRepository.delete).toHaveBeenCalledWith(1);
      expect(KeywordToNoteRepository.delete).toHaveBeenCalledWith({
        note: mockNote,
      });
      expect(SharedNoteRepository.delete).toHaveBeenCalledWith({ noteId: 1 });
      expect(result).toEqual({ id: 1, keywords: [], content: "Note content" });
    });
  });

  describe("shareNote", () => {
    it("should share the note with another user", async () => {
      const mockNote = {
        id: 1,
        user: { id: 1 },
        content: "Note content",
        keywords: [],
      };
      NoteRepository.findOne = jest.fn().mockResolvedValue(mockNote);
      SharedNoteRepository.save = jest.fn();
      // @ts-ignore
      UserService.getUserById = jest.fn();

      const result = await shareNote(1, 2, 1);

      expect(SharedNoteRepository.save).toHaveBeenCalledWith(
        expect.any(SharedNote)
      );
      expect(result).toEqual({ id: 1, keywords: [], content: "Note content" });
    });

    it("should throw an error if sharing with oneself", async () => {
      await expect(shareNote(1, 1, 1)).rejects.toThrow(
        "You cannot share a note with yourself"
      );
    });
  });

  describe("searchNote", () => {
    it("should return matching notes for the user", async () => {
      const mockNotes = [
        { note: { id: 1, content: "Note 1", keywords: ["test"] } },
        { note: { id: 2, content: "Note 2", keywords: ["test"] } },
      ];
      KeywordToNoteRepository.find = jest.fn().mockResolvedValue(mockNotes);

      const result = await searchNote("test", 1);

      expect(result).toHaveLength(2);
    });

    it("should return an empty array if the query is too short", async () => {
      const result = await searchNote("te", 1);

      expect(result).toEqual([]);
    });
  });
});
