// src/application/useCases/session/CreateSession.ts

import { ISessionRepository } from "~/src/application/interfaces/ISessionRepository";
import { Session } from "~/src/core/entities/Session";
export class CreateSession {
  constructor(private readonly repo: ISessionRepository) {}
  async execute(data: {
    token_id: string;
    volunteer_id: number;
    issued_at: Date;
    expires_at: Date;
  }): Promise<Session> {
    return this.repo.createSession(data);
  }
}
