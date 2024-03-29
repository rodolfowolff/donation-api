import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { base64Decode } from "@/utils/base64";
import createError from "http-errors";
import dotenv from "dotenv";

dotenv.config();

export const decodeToken = (token: string) => {
  const parts = token.split(" ");
  let data = null;
  if (parts.length === 2) {
    const credentials = parts[1];
    jwt.verify(
      credentials,
      process.env.JWT_SECRET || "secretDev",
      (err, decoded) => {
        if (err) return null;
        data = decoded;
      }
    );
    return data;
  }
  jwt.verify(
    parts[0],
    process.env.JWT_SECRET || "secretDev",
    (err, decoded) => {
      if (err) return null;
      data = decoded;
    }
  );
  return data;
};

const verifyJWT = (authorization: string) => {
  const parts = authorization.split(" ");
  const [schema, token] = parts;

  if (!/^Bearer$/i.test(schema)) {
    return {
      error: "Invalid schema",
    };
  }

  let tokenError = "";
  jwt.verify(token, process.env.JWT_SECRET || "secretDev", (err) => {
    if (err) {
      tokenError = err.message;
    }
  });

  if (tokenError) {
    throw createError(403, `Invalid token: ${tokenError}`);
  }

  return {
    message: "Token is valid",
  };
};

export const verifyAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw createError(401, "Token not provided");
  }

  const parts = authorization.split(" ");
  const [scheme, token] = parts;

  if (scheme && !/^Basic$/i.test(scheme) && !/^Bearer$/i.test(scheme)) {
    throw createError(403, "Token malformatted");
  }

  if (scheme === "Basic") {
    const decoded = base64Decode(token).split(":");
    const [username, password] = decoded;

    if (
      username !== process.env.BASIC_AUTH_USERNAME ||
      password !== process.env.BASIC_AUTH_PASSWORD
    ) {
      throw createError(403, "Invalid credentials");
    }

    return next();
  } else {
    const { error } = verifyJWT(authorization);
    const decodedToken = decodeToken(token);

    if (!decodedToken) {
      throw createError(403, `${error}`);
    }
  }

  next();
};
