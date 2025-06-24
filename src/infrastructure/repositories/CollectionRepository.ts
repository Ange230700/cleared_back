// src\infrastructure\repositories\CollectionRepository.ts

import { Collection } from "~/src/core/entities/Collection";
import { ICollectionRepository } from "~/src/application/interfaces/ICollectionRepository";
import prisma from "~/prisma/lib/client";

export class CollectionRepository implements ICollectionRepository {
  async getAllCollections(): Promise<Collection[]> {
    const collections = await prisma.collection.findMany();
    return collections.map(
      (collection) =>
        new Collection(
          Number(collection.collection_id),
          collection.collection_date,
          collection.collection_place,
        ),
    );
  }

  async getCollectionById(id: number): Promise<Collection | null> {
    const collection = await prisma.collection.findUnique({
      where: { collection_id: BigInt(id) },
    });
    if (!collection) return null;
    return new Collection(
      Number(collection.collection_id),
      collection.collection_date,
      collection.collection_place,
    );
  }
}
