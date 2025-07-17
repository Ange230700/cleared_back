// src\core\entities\Collection.ts

import { Garbage } from "~/src/core/entities/Garbage";
import { Volunteer } from "~/src/core/entities/Volunteer";

export class Collection {
  constructor(
    public collection_id: number,
    public collection_date: Date,
    public collection_place: string,
    public garbages: Garbage[] = [],
    public volunteers: Volunteer[] = [],
  ) {}
}
