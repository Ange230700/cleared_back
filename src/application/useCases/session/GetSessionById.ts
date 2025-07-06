// src/application/useCases/session/GetSessionById.ts

import { ISessionRepository } from "~/src/application/interfaces/ISessionRepository";
import { Session } from "~/src/core/entities/Session";
export class GetSessionById {
  constructor(private readonly repo: ISessionRepository) {}
  async execute(token_id: string): Promise<Session | null> {
    return this.repo.getSessionById(token_id);
  }
}
