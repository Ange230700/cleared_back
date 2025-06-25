// src/core/entities/Garbage.ts

export class Garbage {
  constructor(
    public garbage_id: number,
    public collection_id: number | null,
    public garbage_type: string,
    public quantity_kg: number,
  ) {}
}
