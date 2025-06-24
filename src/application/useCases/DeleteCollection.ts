// src\application\useCases\DeleteCollection.ts

import { ICollectionRepository } from "~/src/application/interfaces/ICollectionRepository";

export class DeleteCollection {
  constructor(private readonly collectionRepository: ICollectionRepository) {}
  async execute(collection_id: number): Promise<boolean> {
    return this.collectionRepository.deleteCollection(collection_id);
  }
}
