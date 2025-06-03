// src\infrastructure\repositories\CollectionRepository.ts

import { Collection } from "~/src/core/entities/Collection";
import { ICollectionRepository } from "~/src/application/interfaces/ICollectionRepository";
import prisma from "~/src/lib/prisma";

export class CollectionRepository implements ICollectionRepository {
  /**
   * Uses Prisma to load every row from the `collection` table,
   * then maps it into our domain‐level `Collection` entity.
   */
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
}
