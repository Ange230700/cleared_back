// src\infrastructure\repositories\CollectionRepository.ts

import { Collection } from "~/src/core/entities/Collection";
import { ICollectionRepository } from "~/src/application/interfaces/ICollectionRepository";
import prisma from "~/prisma/lib/client";
import { Prisma } from "@prisma/client";
import { Garbage } from "~/src/core/entities/Garbage";
import { Volunteer } from "~/src/core/entities/Volunteer";

export class CollectionRepository implements ICollectionRepository {
  async getAllCollections(): Promise<Collection[]> {
    const collections = await prisma.collection.findMany({
      include: {
        // Include all related garbage for this collection
        garbage: true,
        // Include all related volunteer_collection, then fetch volunteers through it
        volunteer_collection: {
          include: {
            volunteer: true,
          },
        },
      },
    });

    // Map to your entity
    return collections.map(
      (c) =>
        new Collection(
          Number(c.collection_id),
          c.collection_date,
          c.collection_place,
          // map garbages (entities)
          c.garbage.map(
            (g) =>
              new Garbage(
                Number(g.garbage_id),
                g.collection_id ? Number(g.collection_id) : null,
                g.garbage_type,
                g.quantity_kg,
              ),
          ),
          // map volunteers (entities)
          c.volunteer_collection
            .filter((vc) => !!vc.volunteer)
            .map(
              (vc) =>
                new Volunteer(
                  Number(vc.volunteer!.volunteer_id),
                  vc.volunteer!.volunteer_name,
                  vc.volunteer!.volunteer_email,
                  vc.volunteer!.password,
                  vc.volunteer!.role,
                ),
            ),
        ),
    );
  }

  async getCollectionById(collection_id: number): Promise<Collection | null> {
    const collection = await prisma.collection.findUnique({
      where: { collection_id: BigInt(collection_id) },
    });
    if (!collection) return null;
    return new Collection(
      Number(collection.collection_id),
      collection.collection_date,
      collection.collection_place,
    );
  }

  async createCollection(data: {
    collection_date: Date;
    collection_place: string;
  }): Promise<Collection> {
    const created = await prisma.collection.create({
      data: {
        collection_date: data.collection_date,
        collection_place: data.collection_place,
      },
    });
    return new Collection(
      Number(created.collection_id),
      created.collection_date,
      created.collection_place,
    );
  }

  async updateCollection(
    collection_id: number,
    data: { collection_date?: Date; collection_place?: string },
  ): Promise<Collection | null> {
    try {
      const updated = await prisma.collection.update({
        where: { collection_id: BigInt(collection_id) },
        data: {
          ...(data.collection_date && {
            collection_date: data.collection_date,
          }),
          ...(data.collection_place && {
            collection_place: data.collection_place,
          }),
        },
      });
      return new Collection(
        Number(updated.collection_id),
        updated.collection_date,
        updated.collection_place,
      );
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        return null;
      }
      throw e;
    }
  }

  async deleteCollection(collection_id: number): Promise<boolean> {
    try {
      await prisma.collection.delete({
        where: { collection_id: BigInt(collection_id) },
      });
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
