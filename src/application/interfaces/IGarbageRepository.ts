// src/application/interfaces/IGarbageRepository.ts

import { Garbage } from "~/src/core/entities/Garbage";

export interface IGarbageRepository {
  getAllGarbage(): Promise<Garbage[]>;
  getGarbageById(garbage_id: number): Promise<Garbage | null>;
  createGarbage(data: {
    collection_id?: number | null;
    garbage_type: string;
    quantity_kg: number;
  }): Promise<Garbage>;
  updateGarbage(
    garbage_id: number,
    data: {
      collection_id?: number | null;
      garbage_type?: string;
      quantity_kg?: number;
    },
  ): Promise<Garbage | null>;
  deleteGarbage(garbage_id: number): Promise<boolean>;
}
