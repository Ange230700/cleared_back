// src\api\middlewares\role.ts

import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "~/src/api/middlewares/auth";

export function requireRole(role: "admin" | "attendee") {
  return function (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.user || req.user.role !== role) {
      res.status(403).json({
        status: "error",
        data: null,
        error: { message: "Forbidden: insufficient rights", details: null },
      });
      return;
    }
    next();
  };
}
