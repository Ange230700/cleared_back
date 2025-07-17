// src/api/dto/CollectionDTO.ts

import { Collection } from "~/src/core/entities/Collection";

export interface CollectionDTO {
  collection_id: number;
  collection_date: string;
  collection_place: string;
}

export function toCollectionDTO(entity: Collection): CollectionDTO {
  return {
    collection_id: entity.collection_id,
    collection_date: entity.collection_date.toISOString().substring(0, 10),
    collection_place: entity.collection_place,
  };
}
