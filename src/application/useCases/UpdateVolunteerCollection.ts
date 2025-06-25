// src\application\useCases\UpdateVolunteerCollection.ts

import { IVolunteerCollectionRepository } from "~/src/application/interfaces/IVolunteerCollectionRepository";
import { VolunteerCollection } from "~/src/core/entities/VolunteerCollection";
export class UpdateVolunteerCollection {
  constructor(private readonly repo: IVolunteerCollectionRepository) {}
  async execute(
    volunteer_collection_id: number,
    data: {
      volunteer_id?: number | null;
      collection_id?: number | null;
    },
  ): Promise<VolunteerCollection | null> {
    return this.repo.updateVolunteerCollection(volunteer_collection_id, data);
  }
}
