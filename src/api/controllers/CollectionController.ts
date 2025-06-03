// src\api\controllers\CollectionController.ts

import { Request, Response } from "express";
import { GetAllCollections } from "~/src/application/useCases/GetAllCollections";
import { CollectionRepository } from "~/src/infrastructure/repositories/CollectionRepository";

export class CollectionController {
  private readonly getAllCollectionsUseCase: GetAllCollections;

  constructor() {
    const repository = new CollectionRepository();
    this.getAllCollectionsUseCase = new GetAllCollections(repository);
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
}
