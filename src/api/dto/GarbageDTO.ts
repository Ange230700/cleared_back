// src/api/dto/GarbageDTO.ts

import { Garbage } from "~/src/core/entities/Garbage";

export interface GarbageDTO {
  garbage_id: number;
  collection_id: number | null;
  garbage_type: string;
  quantity_kg: number;
}

export function toGarbageDTO(entity: Garbage): GarbageDTO {
  return {
    garbage_id: entity.garbage_id,
    collection_id: entity.collection_id,
    garbage_type: entity.garbage_type,
    quantity_kg: entity.quantity_kg,
  };
}
