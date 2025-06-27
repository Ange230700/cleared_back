// src\application\useCases\authentication\Logout.ts

import { IAuthenticationRepository } from "~/src/application/interfaces/IAuthenticationRepository";

export class Logout {
  constructor(private readonly repo: IAuthenticationRepository) {}
  async execute(refreshToken: string): Promise<void> {
    return this.repo.invalidateRefreshToken(refreshToken);
  }
}
