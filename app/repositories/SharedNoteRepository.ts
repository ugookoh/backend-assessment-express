import { AppDataSource } from "../database";
import { SharedNote } from "../entities";

const SharedNoteRepository = AppDataSource.getRepository(SharedNote);
export default SharedNoteRepository;
