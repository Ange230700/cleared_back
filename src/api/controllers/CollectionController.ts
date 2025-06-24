// src\api\controllers\CollectionController.ts

import { Request, Response } from "express";
import { GetAllCollections } from "~/src/application/useCases/GetAllCollections";
import { GetCollectionById } from "~/src/application/useCases/GetCollectionById";
import { CollectionRepository } from "~/src/infrastructure/repositories/CollectionRepository";

export class CollectionController {
  private readonly getAllCollectionsUseCase: GetAllCollections;
  private readonly getCollectionByIdUseCase: GetCollectionById;

  constructor() {
    const repository = new CollectionRepository();
    this.getAllCollectionsUseCase = new GetAllCollections(repository);
    this.getCollectionByIdUseCase = new GetCollectionById(repository);
  }

  async getAllCollections(req: Request, res: Response): Promise<void> {
    try {
      const collections = await this.getAllCollectionsUseCase.execute();
      res.status(200).json(collections);
    } catch (e) {
      console.error("❌ [CollectionController] getAllCollections error:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getCollectionById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid collection id" });
        return;
      }
      const collection = await this.getCollectionByIdUseCase.execute(id);
      if (!collection) {
        res.status(404).json({ error: "Collection not found" });
        return;
      }
      res.status(200).json(collection);
    } catch (e) {
      console.error("❌ [CollectionController] getCollectionById error:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
