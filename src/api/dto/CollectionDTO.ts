// src/api/dto/CollectionDTO.ts

import { Collection } from "~/src/core/entities/Collection";
import { accumulateGarbage } from "~/src/api/helpers/accumulateGarbage";

export interface CollectionDTO {
  collection_id: number;
  collection_date: string;
  collection_place: string;
  volunteers?: {
    volunteer_id: number;
    volunteer_name: string;
    volunteer_email: string;
  }[];
  garbages?: { garbage_type: string; quantity_kg: number }[];
}

export function toCollectionDTO(entity: Collection): CollectionDTO {
  return {
    collection_id: entity.collection_id,
    collection_date: entity.collection_date.toISOString().substring(0, 10),
    collection_place: entity.collection_place,
    volunteers: entity.volunteers?.map((v) => ({
      volunteer_id: v.volunteer_id,
      volunteer_name: v.volunteer_name,
      volunteer_email: v.volunteer_email,
    })),
    garbages: accumulateGarbage(
      entity.garbages?.map((g) => ({
        garbage_type: g.garbage_type,
        quantity_kg: g.quantity_kg,
      })) ?? [],
    ),
  };
}
