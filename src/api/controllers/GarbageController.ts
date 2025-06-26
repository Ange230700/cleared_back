// src/api/controllers/GarbageController.ts

import { RequestHandler } from "express";
import { GarbageRepository } from "~/src/infrastructure/repositories/GarbageRepository";
import { GetAllGarbage } from "~/src/application/useCases/garbage/GetAllGarbage";
import { GetGarbageById } from "~/src/application/useCases/garbage/GetGarbageById";
import { CreateGarbage } from "~/src/application/useCases/garbage/CreateGarbage";
import { UpdateGarbage } from "~/src/application/useCases/garbage/UpdateGarbage";
import { DeleteGarbage } from "~/src/application/useCases/garbage/DeleteGarbage";
import { toJSONSafe } from "~/src/utils/bigint-to-number";

export class GarbageController {
  private readonly getAllUseCase = new GetAllGarbage(new GarbageRepository());
  private readonly getByIdUseCase = new GetGarbageById(new GarbageRepository());
  private readonly createUseCase = new CreateGarbage(new GarbageRepository());
  private readonly updateUseCase = new UpdateGarbage(new GarbageRepository());
  private readonly deleteUseCase = new DeleteGarbage(new GarbageRepository());

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAllGarbage: RequestHandler = async (req, res, next) => {
    try {
      const items = await this.getAllUseCase.execute();
      res.status(200).json(toJSONSafe(items));
    } catch (e) {
      console.error("❌ [GarbageController] getAllGarbage error:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getGarbageById: RequestHandler = async (req, res, next) => {
    const id = Number(req.params.garbage_id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const item = await this.getByIdUseCase.execute(id);
    if (!item) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.status(200).json(toJSONSafe(item));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createGarbage: RequestHandler = async (req, res, next) => {
    const { collection_id, garbage_type, quantity_kg } = req.body;
    if (!garbage_type || typeof quantity_kg !== "number") {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    const item = await this.createUseCase.execute({
      collection_id,
      garbage_type,
      quantity_kg,
    });
    res.status(201).json(toJSONSafe(item));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateGarbage: RequestHandler = async (req, res, next) => {
    const id = Number(req.params.garbage_id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const { collection_id, garbage_type, quantity_kg } = req.body;
    if (
      collection_id === undefined &&
      garbage_type === undefined &&
      quantity_kg === undefined
    ) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }
    const item = await this.updateUseCase.execute(id, {
      collection_id,
      garbage_type,
      quantity_kg,
    });
    if (!item) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.status(200).json(toJSONSafe(item));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteGarbage: RequestHandler = async (req, res, next) => {
    const id = Number(req.params.garbage_id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const deleted = await this.deleteUseCase.execute(id);
    if (!deleted) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.status(204).send();
  };
}
