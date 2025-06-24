// src\core\entities\Collection.ts

export class Collection {
  constructor(
    public collection_id: number,
    public collection_date: Date,
    public collection_place: string,
  ) {}
}
