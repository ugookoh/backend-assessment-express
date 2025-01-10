import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories";
import { User } from "../entities";

export const signUp = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const existingUser = await UserRepository.findOneBy({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User(email, hashedPassword);
  const savedUser = await UserRepository.save(user);
  const token = jwt.sign({ userId: savedUser.id }, process.env.JWT_SECRET!, {
    expiresIn: "24h",
  });

  return { token, userId: savedUser.id };
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await UserRepository.findOneBy({ email });

  if (!user) {
    throw new Error("This user does not exist, please sign up first");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Password is incorrect, please try again");
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "24h",
  });

  return { token, userId: user.id };
};
