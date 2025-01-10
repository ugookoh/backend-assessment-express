import { UserRepository } from "../repositories";

export const getUserById = async (userId: number) => {
  const user = await UserRepository.findOne({
    where: { id: userId },
    relations: ["notes"],
  });
  if (!user) {
    throw new Error("This user does note exist");
  }
  return user;
};
