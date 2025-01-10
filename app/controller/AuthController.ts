import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "../services";

export const signUp = async (req: Request, res: Response) => {
  try {
    const response = await AuthService.signUp({
      email: req.body.email,
      password: req.body.password,
    });
    res.status(StatusCodes.CREATED).json({ response });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const response = await AuthService.login({
      email: req.body.email,
      password: req.body.password,
    });
    res.status(StatusCodes.OK).json({ response });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};
