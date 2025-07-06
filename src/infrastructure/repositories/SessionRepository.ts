// src\infrastructure\repositories\SessionRepository.ts

import { ISessionRepository } from "~/src/application/interfaces/ISessionRepository";
import { Session } from "~/src/core/entities/Session";
import prisma from "~/prisma/lib/client";
import { Prisma } from "@prisma/client";

export class SessionRepository implements ISessionRepository {
  async getAllSessions(): Promise<Session[]> {
    const sessions = await prisma.session.findMany();
    return sessions.map(
      (s) =>
        new Session(
          s.token_id,
          Number(s.volunteer_id),
          s.issued_at,
          s.expires_at,
        ),
    );
  }

  async getSessionById(token_id: string): Promise<Session | null> {
    const s = await prisma.session.findUnique({ where: { token_id } });
    if (!s) return null;
    return new Session(
      s.token_id,
      Number(s.volunteer_id),
      s.issued_at,
      s.expires_at,
    );
  }

  async createSession(data: {
    token_id: string;
    volunteer_id: number;
    issued_at: Date;
    expires_at: Date;
  }): Promise<Session> {
    const created = await prisma.session.create({
      data: {
        token_id: data.token_id,
        volunteer_id: BigInt(data.volunteer_id),
        issued_at: data.issued_at,
        expires_at: data.expires_at,
      },
    });
    return new Session(
      created.token_id,
      Number(created.volunteer_id),
      created.issued_at,
      created.expires_at,
    );
  }

  async deleteSession(token_id: string): Promise<boolean> {
    try {
      await prisma.session.delete({ where: { token_id } });
      return true;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        return false;
      }
      throw e;
    }
  }
}
