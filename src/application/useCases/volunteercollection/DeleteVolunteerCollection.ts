// src\application\useCases\volunteercollection\DeleteVolunteerCollection.ts

import { IVolunteerCollectionRepository } from "~/src/application/interfaces/IVolunteerCollectionRepository";
export class DeleteVolunteerCollection {
  constructor(private readonly repo: IVolunteerCollectionRepository) {}
  async execute(volunteer_collection_id: number): Promise<boolean> {
    return this.repo.deleteVolunteerCollection(volunteer_collection_id);
  }
}
