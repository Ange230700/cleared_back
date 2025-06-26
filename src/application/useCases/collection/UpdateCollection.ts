// src\application\useCases\collection\UpdateCollection.ts

import { ICollectionRepository } from "~/src/application/interfaces/ICollectionRepository";
import { Collection } from "~/src/core/entities/Collection";

export class UpdateCollection {
  constructor(private readonly collectionRepository: ICollectionRepository) {}
  async execute(
    collection_id: number,
    data: { collection_date?: Date; collection_place?: string },
  ): Promise<Collection | null> {
    return this.collectionRepository.updateCollection(collection_id, data);
  }
}
