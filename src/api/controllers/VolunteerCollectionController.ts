// src\api\controllers\VolunteerCollectionController.ts

import { RequestHandler, Request, Response, NextFunction } from "express";
import { VolunteerCollectionRepository } from "~/src/infrastructure/repositories/VolunteerCollectionRepository";
import { GetAllVolunteerCollections } from "~/src/application/useCases/volunteercollection/GetAllVolunteerCollections";
import { GetVolunteerCollectionById } from "~/src/application/useCases/volunteercollection/GetVolunteerCollectionById";
import { CreateVolunteerCollection } from "~/src/application/useCases/volunteercollection/CreateVolunteerCollection";
import { UpdateVolunteerCollection } from "~/src/application/useCases/volunteercollection/UpdateVolunteerCollection";
import { DeleteVolunteerCollection } from "~/src/application/useCases/volunteercollection/DeleteVolunteerCollection";
import { toJSONSafe } from "~/src/utils/bigint-to-number";
import { sendSuccess, sendError } from "~/src/api/helpers/sendResponse";

export class VolunteerCollectionController {
  private readonly repo = new VolunteerCollectionRepository();
  private readonly getAllUseCase = new GetAllVolunteerCollections(this.repo);
  private readonly getByIdUseCase = new GetVolunteerCollectionById(this.repo);
  private readonly createUseCase = new CreateVolunteerCollection(this.repo);
  private readonly updateUseCase = new UpdateVolunteerCollection(this.repo);
  private readonly deleteUseCase = new DeleteVolunteerCollection(this.repo);

  getAllVolunteerCollections: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const items = await this.getAllUseCase.execute();
      sendSuccess(res, toJSONSafe(items), 200);
    } catch (err) {
      next(err);
    }
  };

  getVolunteerCollectionById: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const volunteer_collection_id = Number(req.params.volunteer_collection_id);
    if (isNaN(volunteer_collection_id)) {
      sendError(res, "Invalid id", 400);
      return;
    }
    try {
      const item = await this.getByIdUseCase.execute(volunteer_collection_id);
      if (!item) {
        sendError(res, "Not found", 404);
        return;
      }
      sendSuccess(res, toJSONSafe(item), 200);
    } catch (err) {
      next(err);
    }
  };

  createVolunteerCollection: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { volunteer_id, collection_id } = req.body;
    if (!volunteer_id || !collection_id) {
      sendError(res, "Missing required fields", 400);
      return;
    }
    try {
      const created = await this.createUseCase.execute({
        volunteer_id,
        collection_id,
      });
      if (!created) {
        sendError(res, "Volunteer collection already exists", 409);
        return;
      }
      sendSuccess(res, toJSONSafe(created), 201);
    } catch (err) {
      next(err);
    }
  };

  updateVolunteerCollection: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const volunteer_collection_id = Number(req.params.volunteer_collection_id);
    if (isNaN(volunteer_collection_id)) {
      sendError(res, "Invalid id", 400);
      return;
    }
    const { volunteer_id, collection_id } = req.body;
    if (volunteer_id === undefined && collection_id === undefined) {
      sendError(res, "No fields to update", 400);
      return;
    }
    try {
      const updated = await this.updateUseCase.execute(
        volunteer_collection_id,
        {
          volunteer_id,
          collection_id,
        },
      );
      if (!updated) {
        sendError(res, "Not found", 404);
        return;
      }
      sendSuccess(res, toJSONSafe(updated), 200);
    } catch (err) {
      next(err);
    }
  };

  deleteVolunteerCollection: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const volunteer_collection_id = Number(req.params.volunteer_collection_id);
    if (isNaN(volunteer_collection_id)) {
      sendError(res, "Invalid id", 400);
      return;
    }
    try {
      const deleted = await this.deleteUseCase.execute(volunteer_collection_id);
      if (!deleted) {
        sendError(res, "Not found", 404);
        return;
      }
      sendSuccess(res, null, 204);
    } catch (err) {
      next(err);
    }
  };
}
