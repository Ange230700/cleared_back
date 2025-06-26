// src\application\useCases\garbage\GetAllGarbage.ts

import { IGarbageRepository } from "~/src/application/interfaces/IGarbageRepository";
import { Garbage } from "~/src/core/entities/Garbage";
export class GetAllGarbage {
  constructor(private readonly repo: IGarbageRepository) {}
  async execute(): Promise<Garbage[]> {
    return this.repo.getAllGarbage();
  }
}
