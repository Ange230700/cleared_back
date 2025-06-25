// src\application\useCases\GetGarbageById.ts

import { IGarbageRepository } from "~/src/application/interfaces/IGarbageRepository";
import { Garbage } from "~/src/core/entities/Garbage";

export class GetGarbageById {
  constructor(private readonly repo: IGarbageRepository) {}

  /**
   * Fetch a single garbage item by garbage_id.
   */
  async execute(garbage_id: number): Promise<Garbage | null> {
    return this.repo.getGarbageById(garbage_id);
  }
}
