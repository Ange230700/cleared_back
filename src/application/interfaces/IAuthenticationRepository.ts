// src\application\interfaces\IAuthenticationRepository.ts

import { AuthUser } from "~/src/core/entities/AuthUser";
import { volunteer_role } from "@prisma/client";

export interface IAuthenticationRepository {
  register(data: {
    volunteer_name: string;
    volunteer_email: string;
    password: string;
    role?: volunteer_role;
  }): Promise<AuthUser>;

  login(data: {
    volunteer_email: string;
    password: string;
  }): Promise<AuthUser | null>;

  storeRefreshToken(data: {
    volunteer_id: number;
    refreshToken: string;
    expiresAt: Date;
  }): Promise<void>;

  findUserByRefreshToken(refreshToken: string): Promise<AuthUser | null>;

  invalidateRefreshToken(refreshToken: string): Promise<void>;
}
