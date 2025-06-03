// src\application\useCases\GetAllCollections.ts

import { Collection } from "~/src/core/entities/Collection";
import { ICollectionRepository } from "~/src/application/interfaces/ICollectionRepository";

export class GetAllCollections {
  constructor(private readonly collectionRepository: ICollectionRepository) {}

  /**
   * Execute the use case: fetch all collections.
   */
  async execute(): Promise<Collection[]> {
    return this.collectionRepository.getAllCollections();
  }
}
