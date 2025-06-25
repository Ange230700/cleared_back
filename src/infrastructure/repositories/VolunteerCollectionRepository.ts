// src\infrastructure\repositories\VolunteerCollectionRepository.ts

import { VolunteerCollection } from "~/src/core/entities/VolunteerCollection";
import { IVolunteerCollectionRepository } from "~/src/application/interfaces/IVolunteerCollectionRepository";
import prisma from "~/prisma/lib/client";
import { Prisma } from "@prisma/client";

export class VolunteerCollectionRepository
  implements IVolunteerCollectionRepository
{
  async getAllVolunteerCollections(): Promise<VolunteerCollection[]> {
    const items = await prisma.volunteer_collection.findMany();
    return items.map(
      (v) =>
        new VolunteerCollection(
          Number(v.volunteer_collection_id),
          v.volunteer_id !== null ? Number(v.volunteer_id) : null,
          v.collection_id !== null ? Number(v.collection_id) : null,
        ),
    );
  }

  async getVolunteerCollectionById(
    volunteer_collection_id: number,
  ): Promise<VolunteerCollection | null> {
    const v = await prisma.volunteer_collection.findUnique({
      where: { volunteer_collection_id: BigInt(volunteer_collection_id) },
    });
    if (!v) return null;
    return new VolunteerCollection(
      Number(v.volunteer_collection_id),
      v.volunteer_id !== null ? Number(v.volunteer_id) : null,
      v.collection_id !== null ? Number(v.collection_id) : null,
    );
  }

  async createVolunteerCollection(data: {
    volunteer_id?: number | null;
    collection_id?: number | null;
  }): Promise<VolunteerCollection> {
    const created = await prisma.volunteer_collection.create({
      data: {
        volunteer_id:
          data.volunteer_id !== undefined && data.volunteer_id !== null
            ? BigInt(data.volunteer_id)
            : null,
        collection_id:
          data.collection_id !== undefined && data.collection_id !== null
            ? BigInt(data.collection_id)
            : null,
      },
    });
    return new VolunteerCollection(
      Number(created.volunteer_collection_id),
      created.volunteer_id !== null ? Number(created.volunteer_id) : null,
      created.collection_id !== null ? Number(created.collection_id) : null,
    );
  }

  async updateVolunteerCollection(
    volunteer_collection_id: number,
    data: {
      volunteer_id?: number | null;
      collection_id?: number | null;
    },
  ): Promise<VolunteerCollection | null> {
    try {
      const updated = await prisma.volunteer_collection.update({
        where: { volunteer_collection_id: BigInt(volunteer_collection_id) },
        data: {
          ...(data.volunteer_id !== undefined
            ? {
                volunteer_id:
                  data.volunteer_id !== null ? BigInt(data.volunteer_id) : null,
              }
            : {}),
          ...(data.collection_id !== undefined
            ? {
                collection_id:
                  data.collection_id !== null
                    ? BigInt(data.collection_id)
                    : null,
              }
            : {}),
        },
      });
      return new VolunteerCollection(
        Number(updated.volunteer_collection_id),
        updated.volunteer_id !== null ? Number(updated.volunteer_id) : null,
        updated.collection_id !== null ? Number(updated.collection_id) : null,
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

  async deleteVolunteerCollection(
    volunteer_collection_id: number,
  ): Promise<boolean> {
    try {
      await prisma.volunteer_collection.delete({
        where: { volunteer_collection_id: BigInt(volunteer_collection_id) },
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
