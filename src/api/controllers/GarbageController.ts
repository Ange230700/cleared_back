// src/api/controllers/GarbageController.ts

import { RequestHandler, Request, Response, NextFunction } from "express";
import { GarbageRepository } from "~/src/infrastructure/repositories/GarbageRepository";
import { GetAllGarbage } from "~/src/application/useCases/garbage/GetAllGarbage";
import { GetGarbageById } from "~/src/application/useCases/garbage/GetGarbageById";
import { CreateGarbage } from "~/src/application/useCases/garbage/CreateGarbage";
import { UpdateGarbage } from "~/src/application/useCases/garbage/UpdateGarbage";
import { DeleteGarbage } from "~/src/application/useCases/garbage/DeleteGarbage";
import { sendSuccess, sendError } from "~/src/api/helpers/sendResponse";
import { toGarbageDTO } from "~/src/api/dto";

export class GarbageController {
  private readonly repo = new GarbageRepository();
  private readonly getAllUseCase = new GetAllGarbage(this.repo);
  private readonly getByIdUseCase = new GetGarbageById(this.repo);
  private readonly createUseCase = new CreateGarbage(this.repo);
  private readonly updateUseCase = new UpdateGarbage(this.repo);
  private readonly deleteUseCase = new DeleteGarbage(this.repo);

  getAllGarbage: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const items = await this.getAllUseCase.execute();
      const dtos = items.map(toGarbageDTO);
      sendSuccess(res, dtos, 200);
    } catch (err) {
      next(err);
    }
  };

  getGarbageById: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const garbage_id = Number(req.params.garbage_id);
    if (isNaN(garbage_id)) {
      sendError(res, "Invalid id", 400);
      return;
    }
    try {
      const item = await this.getByIdUseCase.execute(garbage_id);
      if (!item) {
        sendError(res, "Not found", 404);
        return;
      }
      sendSuccess(res, toGarbageDTO(item), 200);
    } catch (err) {
      next(err);
    }
  };

  createGarbage: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { collection_id, garbage_type, quantity_kg } = req.body;
    if (!garbage_type || typeof quantity_kg !== "number") {
      sendError(res, "Missing required fields", 400);
      return;
    }
    try {
      const created = await this.createUseCase.execute({
        collection_id,
        garbage_type,
        quantity_kg,
      });
      if (!created) {
        sendError(res, "Garbage already exists", 409);
        return;
      }
      sendSuccess(res, toGarbageDTO(created), 201);
    } catch (err) {
      next(err);
    }
  };

  updateGarbage: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const garbage_id = Number(req.params.garbage_id);
    if (isNaN(garbage_id)) {
      sendError(res, "Invalid id", 400);
      return;
    }
    const { collection_id, garbage_type, quantity_kg } = req.body;
    if (
      collection_id === undefined &&
      garbage_type === undefined &&
      quantity_kg === undefined
    ) {
      sendError(res, "No fields to update", 400);
      return;
    }
    try {
      const updated = await this.updateUseCase.execute(garbage_id, {
        collection_id,
        garbage_type,
        quantity_kg,
      });
      if (!updated) {
        sendError(res, "Not found", 404);
        return;
      }
      sendSuccess(res, toGarbageDTO(updated), 200);
    } catch (err) {
      next(err);
    }
  };

  deleteGarbage: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const garbage_id = Number(req.params.garbage_id);
    if (isNaN(garbage_id)) {
      sendError(res, "Invalid id", 400);
      return;
    }
    try {
      const deleted = await this.deleteUseCase.execute(garbage_id);
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
