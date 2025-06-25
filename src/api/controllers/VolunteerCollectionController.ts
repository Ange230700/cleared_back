// src\api\controllers\VolunteerCollectionController.ts

import { RequestHandler } from "express";
import { VolunteerCollectionRepository } from "~/src/infrastructure/repositories/VolunteerCollectionRepository";
import { GetAllVolunteerCollections } from "~/src/application/useCases/GetAllVolunteerCollections";
import { GetVolunteerCollectionById } from "~/src/application/useCases/GetVolunteerCollectionById";
import { CreateVolunteerCollection } from "~/src/application/useCases/CreateVolunteerCollection";
import { UpdateVolunteerCollection } from "~/src/application/useCases/UpdateVolunteerCollection";
import { DeleteVolunteerCollection } from "~/src/application/useCases/DeleteVolunteerCollection";
import { toJSONSafe } from "~/src/utils/bigint-to-number";

export class VolunteerCollectionController {
  private readonly getAllUseCase = new GetAllVolunteerCollections(
    new VolunteerCollectionRepository(),
  );
  private readonly getByIdUseCase = new GetVolunteerCollectionById(
    new VolunteerCollectionRepository(),
  );
  private readonly createUseCase = new CreateVolunteerCollection(
    new VolunteerCollectionRepository(),
  );
  private readonly updateUseCase = new UpdateVolunteerCollection(
    new VolunteerCollectionRepository(),
  );
  private readonly deleteUseCase = new DeleteVolunteerCollection(
    new VolunteerCollectionRepository(),
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAllVolunteerCollections: RequestHandler = async (req, res, next) => {
    try {
      const items = await this.getAllUseCase.execute();
      res.status(200).json(toJSONSafe(items));
    } catch (e) {
      console.error(
        "❌ [VolunteerCollectionController] getAllVolunteerCollections error:",
        e,
      );
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getVolunteerCollectionById: RequestHandler = async (req, res, next) => {
    try {
      const volunteer_collection_id = Number(
        req.params.volunteer_collection_id,
      );
      if (isNaN(volunteer_collection_id)) {
        res.status(400).json({ error: "Invalid id" });
        return;
      }
      const item = await this.getByIdUseCase.execute(volunteer_collection_id);
      if (!item) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.status(200).json(toJSONSafe(item));
    } catch (e) {
      console.error(
        "❌ [VolunteerCollectionController] getVolunteerCollectionById error:",
        e,
      );
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createVolunteerCollection: RequestHandler = async (req, res, next) => {
    try {
      const { volunteer_id, collection_id } = req.body;
      if (!volunteer_id || !collection_id) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
      const item = await this.createUseCase.execute({
        volunteer_id,
        collection_id,
      });
      res.status(201).json(toJSONSafe(item));
    } catch (e) {
      console.error(
        "❌ [VolunteerCollectionController] createVolunteerCollection error:",
        e,
      );
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateVolunteerCollection: RequestHandler = async (req, res, next) => {
    try {
      const volunteer_collection_id = Number(
        req.params.volunteer_collection_id,
      );
      if (isNaN(volunteer_collection_id)) {
        res.status(400).json({ error: "Invalid id" });
        return;
      }
      const { volunteer_id, collection_id } = req.body;
      if (volunteer_id === undefined && collection_id === undefined) {
        res.status(400).json({ error: "No fields to update" });
        return;
      }
      const item = await this.updateUseCase.execute(volunteer_collection_id, {
        volunteer_id,
        collection_id,
      });
      if (!item) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.status(200).json(toJSONSafe(item));
    } catch (e) {
      console.error(
        "❌ [VolunteerCollectionController] updateVolunteerCollection error:",
        e,
      );
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteVolunteerCollection: RequestHandler = async (req, res, next) => {
    try {
      const volunteer_collection_id = Number(
        req.params.volunteer_collection_id,
      );
      if (isNaN(volunteer_collection_id)) {
        res.status(400).json({ error: "Invalid id" });
        return;
      }
      const deleted = await this.deleteUseCase.execute(volunteer_collection_id);
      if (!deleted) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.status(204).send();
    } catch (e) {
      console.error(
        "❌ [VolunteerCollectionController] deleteVolunteerCollection error:",
        e,
      );
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
