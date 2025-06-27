// src\application\useCases\authentication\Register.ts

import { IAuthenticationRepository } from "~/src/application/interfaces/IAuthenticationRepository";
import { AuthUser } from "~/src/core/entities/AuthUser";
import { volunteer_role } from "@prisma/client";

export class Register {
  constructor(private readonly repo: IAuthenticationRepository) {}
  async execute(data: {
    volunteer_name: string;
    volunteer_email: string;
    password: string;
    role?: volunteer_role;
  }): Promise<AuthUser> {
    return this.repo.register(data);
  }
}
