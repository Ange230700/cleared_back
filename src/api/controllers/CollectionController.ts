// src\api\controllers\CollectionController.ts

import { RequestHandler } from "express";
import { GetAllCollections } from "~/src/application/useCases/collection/GetAllCollections";
import { GetCollectionById } from "~/src/application/useCases/collection/GetCollectionById";
import { CreateCollection } from "~/src/application/useCases/collection/CreateCollection";
import { UpdateCollection } from "~/src/application/useCases/collection/UpdateCollection";
import { DeleteCollection } from "~/src/application/useCases/collection/DeleteCollection";
import { CollectionRepository } from "~/src/infrastructure/repositories/CollectionRepository";
import { toJSONSafe } from "~/src/utils/bigint-to-number";

export class CollectionController {
  private readonly getAllCollectionsUseCase = new GetAllCollections(
    new CollectionRepository(),
  );
  private readonly getCollectionByIdUseCase = new GetCollectionById(
    new CollectionRepository(),
  );
  private readonly createCollectionUseCase = new CreateCollection(
    new CollectionRepository(),
  );
  private readonly updateCollectionUseCase = new UpdateCollection(
    new CollectionRepository(),
  );
  private readonly deleteCollectionUseCase = new DeleteCollection(
    new CollectionRepository(),
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAllCollections: RequestHandler = async (req, res, next) => {
    try {
      const collections = await this.getAllCollectionsUseCase.execute();
      res.status(200).json(toJSONSafe(collections));
    } catch (e) {
      console.error("❌ [CollectionController] getAllCollections error:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCollectionById: RequestHandler = async (req, res, next) => {
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
      res.status(200).json(toJSONSafe(collection));
    } catch (e) {
      console.error("❌ [CollectionController] getCollectionById error:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createCollection: RequestHandler = async (req, res, next) => {
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
      res.status(201).json(toJSONSafe(created));
    } catch (e) {
      console.error("❌ [CollectionController] createCollection error:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateCollection: RequestHandler = async (req, res, next) => {
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
      res.status(200).json(toJSONSafe(updated));
    } catch (e) {
      console.error("❌ [CollectionController] updateCollection error:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteCollection: RequestHandler = async (req, res, next) => {
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
  };
}
