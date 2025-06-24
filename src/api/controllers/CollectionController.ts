// src\api\controllers\CollectionController.ts

import { Request, Response } from "express";
import { GetAllCollections } from "~/src/application/useCases/GetAllCollections";
import { GetCollectionById } from "~/src/application/useCases/GetCollectionById";
import { CreateCollection } from "~/src/application/useCases/CreateCollection";
import { UpdateCollection } from "~/src/application/useCases/UpdateCollection";
import { DeleteCollection } from "~/src/application/useCases/DeleteCollection";
import { CollectionRepository } from "~/src/infrastructure/repositories/CollectionRepository";

export class CollectionController {
  private readonly getAllCollectionsUseCase: GetAllCollections;
  private readonly getCollectionByIdUseCase: GetCollectionById;
  private readonly createCollectionUseCase: CreateCollection;
  private readonly updateCollectionUseCase: UpdateCollection;
  private readonly deleteCollectionUseCase: DeleteCollection;

  constructor() {
    const repository = new CollectionRepository();
    this.getAllCollectionsUseCase = new GetAllCollections(repository);
    this.getCollectionByIdUseCase = new GetCollectionById(repository);
    this.createCollectionUseCase = new CreateCollection(repository);
    this.updateCollectionUseCase = new UpdateCollection(repository);
    this.deleteCollectionUseCase = new DeleteCollection(repository);
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
      const collection_id = Number(req.params.collection_id);
      if (isNaN(collection_id)) {
        res.status(400).json({ error: "Invalid collection collection_id" });
        return;
      }
      const collection =
        await this.getCollectionByIdUseCase.execute(collection_id);
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

  async createCollection(req: Request, res: Response): Promise<void> {
    try {
      const { collection_date, collection_place } = req.body;
      if (!collection_date || !collection_place) {
        res.status(400).json({
          error: "Missing 'collection_date' or 'collection_place' in body",
        });
        return;
      }
      const created = await this.createCollectionUseCase.execute({
        collection_date: new Date(collection_date),
        collection_place,
      });
      res.status(201).json(created);
    } catch (e) {
      console.error("❌ [CollectionController] createCollection error:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateCollection(req: Request, res: Response): Promise<void> {
    try {
      const collection_id = Number(req.params.collection_id);
      const { collection_date, collection_place } = req.body;
      if (isNaN(collection_id)) {
        res.status(400).json({ error: "Invalid collection collection_id" });
        return;
      }
      if (!collection_date && !collection_place) {
        res.status(400).json({
          error:
            "At least one of 'collection_date' or 'collection_place' must be provided",
        });
        return;
      }
      const updated = await this.updateCollectionUseCase.execute(
        collection_id,
        {
          ...(collection_date && {
            collection_date: new Date(collection_date),
          }),
          ...(collection_place && { collection_place }),
        },
      );
      if (!updated) {
        res.status(404).json({ error: "Collection not found" });
        return;
      }
      res.status(200).json(updated);
    } catch (e) {
      console.error("❌ [CollectionController] updateCollection error:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteCollection(req: Request, res: Response): Promise<void> {
    try {
      const collection_id = Number(req.params.collection_id);
      if (isNaN(collection_id)) {
        res.status(400).json({ error: "Invalid collection collection_id" });
        return;
      }
      const deleted = await this.deleteCollectionUseCase.execute(collection_id);
      if (!deleted) {
        res.status(404).json({ error: "Collection not found" });
        return;
      }
      res.status(204).send();
    } catch (e) {
      console.error("❌ [CollectionController] deleteCollection error:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
