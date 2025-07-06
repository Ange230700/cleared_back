// src/application/useCases/session/DeleteSession.ts

import { ISessionRepository } from "~/src/application/interfaces/ISessionRepository";
export class DeleteSession {
  constructor(private readonly repo: ISessionRepository) {}
  async execute(token_id: string): Promise<boolean> {
    return this.repo.deleteSession(token_id);
  }
}
