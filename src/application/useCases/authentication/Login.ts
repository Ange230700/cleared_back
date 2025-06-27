// src\application\interfaces\IAuthenticationRepository.ts

import { IAuthenticationRepository } from "~/src/application/interfaces/IAuthenticationRepository";
import { AuthUser } from "~/src/core/entities/AuthUser";

export class Login {
  constructor(private readonly repo: IAuthenticationRepository) {}
  async execute(data: {
    volunteer_email: string;
    password: string;
  }): Promise<AuthUser | null> {
    return this.repo.login(data);
  }
}
