// src\application\interfaces\ICollectionRepository.ts

import { Collection } from "~/src/core/entities/Collection";

export interface ICollectionRepository {
  /**
   * Fetches all collections from the data source.
   * @returns an array of Collection entities
   */
  getAllCollections(): Promise<Collection[]>;

  /** Fetches a collection by its collection_id. Returns null if not found. */
  getCollectionById(collection_id: number): Promise<Collection | null>;

  /** Creates a new collection in the data source. */
  createCollection(data: {
    collection_date: Date;
    collection_place: string;
  }): Promise<Collection>;

  /** Updates an existing collection in the data source. */
  updateCollection(
    collection_id: number,
    data: { collection_date?: Date; collection_place?: string },
  ): Promise<Collection | null>;

  /** Deletes a collection from the data source. */
  deleteCollection(collection_id: number): Promise<boolean>;
}
