// src\application\useCases\CreateGarbage.ts

import { IGarbageRepository } from "~/src/application/interfaces/IGarbageRepository";
import { Garbage } from "~/src/core/entities/Garbage";

export class CreateGarbage {
  constructor(private readonly repo: IGarbageRepository) {}
  async execute(data: {
    garbage_type: string;
    quantity_kg: number;
    collection_id?: number | null;
  }): Promise<Garbage> {
    return this.repo.createGarbage(data);
  }
}
