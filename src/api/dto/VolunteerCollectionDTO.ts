// src/api/dto/VolunteerCollectionDTO.ts

import { VolunteerCollection } from "~/src/core/entities/VolunteerCollection";

export interface VolunteerCollectionDTO {
  volunteer_collection_id: number;
  volunteer_id: number | null;
  collection_id: number | null;
}

export function toVolunteerCollectionDTO(
  entity: VolunteerCollection,
): VolunteerCollectionDTO {
  return {
    volunteer_collection_id: entity.volunteer_collection_id,
    volunteer_id: entity.volunteer_id,
    collection_id: entity.collection_id,
  };
}
