// src\application\interfaces\ISessionRepository.ts

import { Session } from "~/src/core/entities/Session";

export interface ISessionRepository {
  getAllSessions(): Promise<Session[]>;
  getSessionById(token_id: string): Promise<Session | null>;
  createSession(data: {
    token_id: string;
    volunteer_id: number;
    issued_at: Date;
    expires_at: Date;
  }): Promise<Session>;
  deleteSession(token_id: string): Promise<boolean>;
}
