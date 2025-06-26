// src\application\useCases\volunteercollection\GetVolunteerCollectionById.ts

import { IVolunteerCollectionRepository } from "~/src/application/interfaces/IVolunteerCollectionRepository";
import { VolunteerCollection } from "~/src/core/entities/VolunteerCollection";
export class GetVolunteerCollectionById {
  constructor(private readonly repo: IVolunteerCollectionRepository) {}
  async execute(
    volunteer_collection_id: number,
  ): Promise<VolunteerCollection | null> {
    return this.repo.getVolunteerCollectionById(volunteer_collection_id);
  }
}
