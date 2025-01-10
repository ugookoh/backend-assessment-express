import { AppDataSource } from '../database';
import { User } from '../entities';

const UserRepository = AppDataSource.getRepository(User);
export default UserRepository