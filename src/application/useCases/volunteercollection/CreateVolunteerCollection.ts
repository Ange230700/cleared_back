// src\application\useCases\volunteercollection\CreateVolunteerCollection.ts

import { IVolunteerCollectionRepository } from "~/src/application/interfaces/IVolunteerCollectionRepository";
import { VolunteerCollection } from "~/src/core/entities/VolunteerCollection";
export class CreateVolunteerCollection {
  constructor(private readonly repo: IVolunteerCollectionRepository) {}
  async execute(data: {
    volunteer_id?: number | null;
    collection_id?: number | null;
  }): Promise<VolunteerCollection> {
    return this.repo.createVolunteerCollection(data);
  }
}
