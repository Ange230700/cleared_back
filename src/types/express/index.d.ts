// src\types\express\index.d.ts

import { AuthPayload } from "../../utils/jwt"; // adjust path if needed

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
