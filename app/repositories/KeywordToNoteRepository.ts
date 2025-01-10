import { AppDataSource } from "../database";
import { KeywordToNote } from "../entities";

const KeywordToNoteRepository = AppDataSource.getRepository(KeywordToNote);
export default KeywordToNoteRepository;
