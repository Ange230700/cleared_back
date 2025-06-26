// src\application\useCases\volunteercollection\GetAllVolunteerCollections.ts

import { IVolunteerCollectionRepository } from "~/src/application/interfaces/IVolunteerCollectionRepository";
import { VolunteerCollection } from "~/src/core/entities/VolunteerCollection";
export class GetAllVolunteerCollections {
  constructor(private readonly repo: IVolunteerCollectionRepository) {}
  async execute(): Promise<VolunteerCollection[]> {
    return this.repo.getAllVolunteerCollections();
  }
}
