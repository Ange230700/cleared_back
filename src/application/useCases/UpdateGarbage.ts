// src\application\useCases\UpdateGarbage.ts

import { IGarbageRepository } from "~/src/application/interfaces/IGarbageRepository";
import { Garbage } from "~/src/core/entities/Garbage";

export class UpdateGarbage {
  constructor(private readonly repo: IGarbageRepository) {}
  async execute(
    garbage_id: number,
    data: {
      garbage_type?: string;
      quantity_kg?: number;
      collection_id?: number | null;
    },
  ): Promise<Garbage | null> {
    return this.repo.updateGarbage(garbage_id, data);
  }
}
