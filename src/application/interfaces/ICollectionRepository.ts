// src\application\interfaces\ICollectionRepository.ts

import { Collection } from "~/src/core/entities/Collection";

export interface ICollectionRepository {
  /**
   * Fetches all collections from the data source.
   * @returns an array of Collection entities
   */
  getAllCollections(): Promise<Collection[]>;

  /** Fetches a collection by its id. Returns null if not found. */
  getCollectionById(id: number): Promise<Collection | null>;
}
