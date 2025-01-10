import { AppDataSource } from '../database';
import { Note } from '../entities';

const NoteRepository = AppDataSource.getRepository(Note);
export default NoteRepository
