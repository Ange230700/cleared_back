// src\application\useCases\GetCollectionById.ts

import { ICollectionRepository } from "~/src/application/interfaces/ICollectionRepository";
import { Collection } from "~/src/core/entities/Collection";

export class GetCollectionById {
  constructor(private readonly collectionRepository: ICollectionRepository) {}

  /**
   * Fetch a single collection by collection_id.
   */
  async execute(collection_id: number): Promise<Collection | null> {
    return this.collectionRepository.getCollectionById(collection_id);
  }
}
