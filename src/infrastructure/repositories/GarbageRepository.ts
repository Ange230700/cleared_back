// src/infrastructure/repositories/GarbageRepository.ts

import { Garbage } from "~/src/core/entities/Garbage";
import { IGarbageRepository } from "~/src/application/interfaces/IGarbageRepository";
import prisma from "~/prisma/lib/client";
import { Prisma } from "@prisma/client";

export class GarbageRepository implements IGarbageRepository {
  async getAllGarbage(): Promise<Garbage[]> {
    const garbages = await prisma.garbage.findMany();
    return garbages.map(
      (g) =>
        new Garbage(
          Number(g.garbage_id),
          g.collection_id ? Number(g.collection_id) : null,
          g.garbage_type,
          g.quantity_kg,
        ),
    );
  }

  async getGarbageById(garbage_id: number): Promise<Garbage | null> {
    const g = await prisma.garbage.findUnique({
      where: { garbage_id: BigInt(garbage_id) },
    });
    if (!g) return null;
    return new Garbage(
      Number(g.garbage_id),
      g.collection_id ? Number(g.collection_id) : null,
      g.garbage_type,
      g.quantity_kg,
    );
  }

  async createGarbage(data: {
    garbage_type: string;
    quantity_kg: number;
  }): Promise<Garbage> {
    const created = await prisma.garbage.create({
      data: {
        garbage_type: data.garbage_type,
        quantity_kg: data.quantity_kg,
      },
    });
    return new Garbage(
      Number(created.garbage_id),
      created.collection_id ? Number(created.collection_id) : null,
      created.garbage_type,
      created.quantity_kg,
    );
  }

  async updateGarbage(
    garbage_id: number,
    data: {
      collection_id?: number | null;
      garbage_type?: string;
      quantity_kg?: number;
    },
  ): Promise<Garbage | null> {
    try {
      const updated = await prisma.garbage.update({
        where: { garbage_id: BigInt(garbage_id) },
        data: {
          ...(data.collection_id !== undefined && {
            collection_id:
              data.collection_id !== null ? BigInt(data.collection_id) : null,
          }),
          ...(data.garbage_type && { garbage_type: data.garbage_type }),
          ...(data.quantity_kg !== undefined && {
            quantity_kg: data.quantity_kg,
          }),
        },
      });
      return new Garbage(
        Number(updated.garbage_id),
        updated.collection_id ? Number(updated.collection_id) : null,
        updated.garbage_type,
        updated.quantity_kg,
      );
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      )
        return null;
      throw e;
    }
  }

  async deleteGarbage(garbage_id: number): Promise<boolean> {
    try {
      await prisma.garbage.delete({
        where: { garbage_id: BigInt(garbage_id) },
      });
      return true;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      )
        return false;
      throw e;
    }
  }
}
