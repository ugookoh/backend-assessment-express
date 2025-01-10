import Joi from "joi";

export const getNoteByIdQuery = Joi.object({
  id: Joi.string().required(),
});

export const createNoteBody = Joi.object({
  content: Joi.string().min(3).required(),
  keywords: Joi.array().items(Joi.string()),
});
export const updateNoteBody = Joi.object({
  content: Joi.string().min(3).required(),
  noteId: Joi.number().required(),
});

export const deleteNoteBody = Joi.object({
  noteId: Joi.number().required(),
});

export const shareNoteBody = Joi.object({
  noteId: Joi.number().required(),
  sharedUserId: Joi.number().required(),
});
