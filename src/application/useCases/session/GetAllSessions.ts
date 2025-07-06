// src/application/useCases/session/GetAllSessions.ts

import { ISessionRepository } from "~/src/application/interfaces/ISessionRepository";
import { Session } from "~/src/core/entities/Session";
export class GetAllSessions {
  constructor(private readonly repo: ISessionRepository) {}
  async execute(): Promise<Session[]> {
    return this.repo.getAllSessions();
  }
}
