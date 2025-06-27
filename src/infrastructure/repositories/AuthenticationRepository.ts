// src\infrastructure\repositories\AuthenticationRepository.ts

import { AuthUser } from "~/src/core/entities/AuthUser";
import { IAuthenticationRepository } from "~/src/application/interfaces/IAuthenticationRepository";
import prisma from "~/prisma/lib/client";
import { volunteer_role } from "@prisma/client";
import argon2 from "argon2";

export class AuthenticationRepository implements IAuthenticationRepository {
  async register(data: {
    volunteer_name: string;
    volunteer_email: string;
    password: string;
    role?: volunteer_role;
  }): Promise<AuthUser> {
    const hashed = await argon2.hash(data.password);
    const user = await prisma.volunteer.create({
      data: {
        volunteer_name: data.volunteer_name,
        volunteer_email: data.volunteer_email,
        password: hashed,
        role: data.role ?? "attendee",
      },
    });
    return {
      volunteer_id: Number(user.volunteer_id),
      volunteer_name: user.volunteer_name,
      volunteer_email: user.volunteer_email,
      role: user.role,
    };
  }

  async login(data: {
    volunteer_email: string;
    password: string;
  }): Promise<AuthUser | null> {
    const user = await prisma.volunteer.findUnique({
      where: { volunteer_email: data.volunteer_email },
    });
    if (!user) return null;
    const valid = await argon2.verify(user.password, data.password);
    if (!valid) return null;
    return {
      volunteer_id: Number(user.volunteer_id),
      volunteer_email: user.volunteer_email,
      volunteer_name: user.volunteer_name,
      role: user.role,
    };
  }

  async storeRefreshToken(data: {
    volunteer_id: number;
    refreshToken: string;
    expiresAt: Date;
  }): Promise<void> {
    // Store in 'session' table, using refreshToken as the token_id
    await prisma.session.create({
      data: {
        token_id: data.refreshToken,
        volunteer_id: BigInt(data.volunteer_id),
        issued_at: new Date(),
        expires_at: data.expiresAt,
      },
    });
  }

  async findUserByRefreshToken(refreshToken: string): Promise<AuthUser | null> {
    const session = await prisma.session.findUnique({
      where: { token_id: refreshToken },
      include: { volunteer: true },
    });
    if (!session || !session.volunteer || session.expires_at < new Date())
      return null;
    const user = session.volunteer;
    return {
      volunteer_id: Number(user.volunteer_id),
      volunteer_email: user.volunteer_email,
      volunteer_name: user.volunteer_name,
      role: user.role,
    };
  }

  async invalidateRefreshToken(refreshToken: string): Promise<void> {
    await prisma.session.deleteMany({ where: { token_id: refreshToken } });
  }
}
