import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { signUp, login } from "../AuthService";
import { UserRepository } from "../../repositories";
import { User } from "../../entities";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../repositories/UserRepository");

describe("Auth Service", () => {
  const mockUser = {
    id: 1,
    email: "test@example.com",
    password: "hashedPassword",
  };

  const mockToken = "mockToken";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signUp", () => {
    it("should create a new user and return a token and user ID", async () => {
      (UserRepository.findOneBy as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (UserRepository.save as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const result = await signUp({
        email: "test@example.com",
        password: "password123",
      });

      expect(UserRepository.findOneBy).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(UserRepository.save).toHaveBeenCalledWith(expect.any(User));
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser.id },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      expect(result).toEqual({ token: mockToken, userId: mockUser.id });
    });

    it("should throw an error if the user already exists", async () => {
      (UserRepository.findOneBy as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        signUp({ email: "test@example.com", password: "password123" })
      ).rejects.toThrow("User already exists");
    });
  });

  describe("login", () => {
    it("should log in a user and return a token and user ID", async () => {
      (UserRepository.findOneBy as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const result = await login({
        email: "test@example.com",
        password: "password123",
      });

      expect(UserRepository.findOneBy).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashedPassword"
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser.id },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      expect(result).toEqual({ token: mockToken, userId: mockUser.id });
    });

    it("should throw an error if the user does not exist", async () => {
      (UserRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(
        login({ email: "test@example.com", password: "password123" })
      ).rejects.toThrow("This user does not exist, please sign up first");
    });

    it("should throw an error if the password is incorrect", async () => {
      (UserRepository.findOneBy as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        login({ email: "test@example.com", password: "wrongpassword" })
      ).rejects.toThrow("Password is incorrect, please try again");
    });
  });
});
