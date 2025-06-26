// src\application\useCases\collection\CreateCollection.ts

import { ICollectionRepository } from "~/src/application/interfaces/ICollectionRepository";
import { Collection } from "~/src/core/entities/Collection";

export class CreateCollection {
  constructor(private readonly collectionRepository: ICollectionRepository) {}
  async execute(data: {
    collection_date: Date;
    collection_place: string;
  }): Promise<Collection> {
    return this.collectionRepository.createCollection(data);
  }
}
