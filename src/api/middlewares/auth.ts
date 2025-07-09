// src\api\middlewares\auth.ts

import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, AuthPayload } from "~/src/utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      status: "error",
      data: null,
      error: {
        message: "Missing or invalid Authorization header",
        details: null,
      },
    });
    return;
  }
  try {
    const token = authHeader.replace("Bearer ", "");
    req.user = verifyAccessToken(token) as AuthPayload;
    next();
  } catch (err) {
    console.error("[requireAuth] JWT verification error:", err);
    res.status(401).json({
      status: "error",
      data: null,
      error: { message: "Invalid or expired token", details: null },
    });
    return;
  }
}
