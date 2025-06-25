// src\core\entities\VolunteerCollection.ts

export class VolunteerCollection {
  constructor(
    public volunteer_collection_id: number,
    public volunteer_id: number | null,
    public collection_id: number | null,
  ) {}
}
