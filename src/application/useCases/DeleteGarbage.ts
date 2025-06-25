// src\application\useCases\DeleteGarbage.ts

import { IGarbageRepository } from "~/src/application/interfaces/IGarbageRepository";

export class DeleteGarbage {
  constructor(private readonly repo: IGarbageRepository) {}
  async execute(garbage_id: number): Promise<boolean> {
    return this.repo.deleteGarbage(garbage_id);
  }
}
