import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ObjectSchema } from "joi";
import jwt from "jsonwebtoken";

export const validateRequest = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.details[0].message });
    }
    next();
  };
};

export const validateQuery = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let { error } = schema.validate(req.params);

    const id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "The noteId is not valid" });
    }

    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.details[0].message });
    }
    next();
  };
};

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Access token is missing or invalid" });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded: any) => {
    if (err) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: "Invalid token" });
    }
    req.body.userId = decoded.userId;
    next();
  });
};

const rateLimitStore: { [key: string]: { count: number; timestamp: number } } =
  {};

export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip;
  const currentTime = Date.now();
  const limit = Number(process.env.AMOUNT_ALLOWED_PER_UNIT || 10);
  const timeFrame = Number(process.env.UNIT_IN_MINS || 60) * 1000;

  if (!rateLimitStore[ip]) {
    rateLimitStore[ip] = { count: 1, timestamp: currentTime };
    next();
  } else {
    const timeElapsed = currentTime - rateLimitStore[ip].timestamp;

    if (timeElapsed < timeFrame) {
      if (rateLimitStore[ip].count >= limit) {
        return res
          .status(StatusCodes.TOO_MANY_REQUESTS)
          .json({ message: "Too many requests. Please try again later." });
      }
      rateLimitStore[ip].count += 1;
      next();
    } else {
      rateLimitStore[ip] = { count: 1, timestamp: currentTime };
      next();
    }
  }
};

export default rateLimiter;
