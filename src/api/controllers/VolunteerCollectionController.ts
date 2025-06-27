// src\api\controllers\VolunteerCollectionController.ts

import { RequestHandler } from "express";
import { VolunteerCollectionRepository } from "~/src/infrastructure/repositories/VolunteerCollectionRepository";
import { GetAllVolunteerCollections } from "~/src/application/useCases/volunteercollection/GetAllVolunteerCollections";
import { GetVolunteerCollectionById } from "~/src/application/useCases/volunteercollection/GetVolunteerCollectionById";
import { CreateVolunteerCollection } from "~/src/application/useCases/volunteercollection/CreateVolunteerCollection";
import { UpdateVolunteerCollection } from "~/src/application/useCases/volunteercollection/UpdateVolunteerCollection";
import { DeleteVolunteerCollection } from "~/src/application/useCases/volunteercollection/DeleteVolunteerCollection";
import { toJSONSafe } from "~/src/utils/bigint-to-number";

export class VolunteerCollectionController {
  private readonly repo = new VolunteerCollectionRepository();
  private readonly getAllUseCase = new GetAllVolunteerCollections(this.repo);
  private readonly getByIdUseCase = new GetVolunteerCollectionById(this.repo);
  private readonly createUseCase = new CreateVolunteerCollection(this.repo);
  private readonly updateUseCase = new UpdateVolunteerCollection(this.repo);
  private readonly deleteUseCase = new DeleteVolunteerCollection(this.repo);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAllVolunteerCollections: RequestHandler = async (req, res, next) => {
    const items = await this.getAllUseCase.execute();
    res.status(200).json(toJSONSafe(items));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getVolunteerCollectionById: RequestHandler = async (req, res, next) => {
    const volunteer_collection_id = Number(req.params.volunteer_collection_id);
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
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createVolunteerCollection: RequestHandler = async (req, res, next) => {
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
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateVolunteerCollection: RequestHandler = async (req, res, next) => {
    const volunteer_collection_id = Number(req.params.volunteer_collection_id);
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
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteVolunteerCollection: RequestHandler = async (req, res, next) => {
    const volunteer_collection_id = Number(req.params.volunteer_collection_id);
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
  };
}
