// src\application\interfaces\IVolunteerCollectionRepository.ts

import { VolunteerCollection } from "~/src/core/entities/VolunteerCollection";

export interface IVolunteerCollectionRepository {
  getAllVolunteerCollections(): Promise<VolunteerCollection[]>;
  getVolunteerCollectionById(
    volunteer_collection_id: number,
  ): Promise<VolunteerCollection | null>;
  createVolunteerCollection(data: {
    volunteer_id?: number | null;
    collection_id?: number | null;
  }): Promise<VolunteerCollection>;
  updateVolunteerCollection(
    volunteer_collection_id: number,
    data: {
      volunteer_id?: number | null;
      collection_id?: number | null;
    },
  ): Promise<VolunteerCollection | null>;
  deleteVolunteerCollection(volunteer_collection_id: number): Promise<boolean>;
}
