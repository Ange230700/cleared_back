// src\application\interfaces\ICollectionRepository.ts

import { Collection } from "~/src/core/entities/Collection";

export interface ICollectionRepository {
  /**
   * Fetches all collections from the data source.
   * @returns an array of Collection entities
   */
  getAllCollections(): Promise<Collection[]>;
}
