// src\utils\jwt.ts

import jwt from "jsonwebtoken";
import { volunteer_role } from "@prisma/client";

const secret = process.env.JWT_SECRET!;
if (!secret) throw new Error("JWT_SECRET is not defined");

export interface AuthPayload {
  volunteer_id: number;
  role: volunteer_role;
  [key: string]: unknown; // If there may be extra claims
}

export function signAccessToken(payload: object, expiresIn?: string) {
  // Default to '1h' if not set or empty
  const safeExpiresIn: string =
    expiresIn && typeof expiresIn === "string" && expiresIn.trim() !== ""
      ? expiresIn
      : "1h";
  return jwt.sign(payload, secret, { expiresIn: safeExpiresIn });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, secret);
}
