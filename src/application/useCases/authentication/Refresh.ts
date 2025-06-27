// src\application\useCases\authentication\Refresh.ts

import { IAuthenticationRepository } from "~/src/application/interfaces/IAuthenticationRepository";
import { AuthUser } from "~/src/core/entities/AuthUser";

export class Refresh {
  constructor(private readonly repo: IAuthenticationRepository) {}
  async execute(refreshToken: string): Promise<AuthUser | null> {
    return this.repo.findUserByRefreshToken(refreshToken);
  }
}
