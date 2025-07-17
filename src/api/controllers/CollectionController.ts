// src\api\controllers\CollectionController.ts

import { RequestHandler, Request, Response, NextFunction } from "express";
import { GetAllCollections } from "~/src/application/useCases/collection/GetAllCollections";
import { GetCollectionById } from "~/src/application/useCases/collection/GetCollectionById";
import { CreateCollection } from "~/src/application/useCases/collection/CreateCollection";
import { UpdateCollection } from "~/src/application/useCases/collection/UpdateCollection";
import { DeleteCollection } from "~/src/application/useCases/collection/DeleteCollection";
import { CollectionRepository } from "~/src/infrastructure/repositories/CollectionRepository";
import { sendSuccess, sendError } from "~/src/api/helpers/sendResponse";
import { toCollectionDTO } from "~/src/api/dto";

export class CollectionController {
  private readonly repo = new CollectionRepository();
  private readonly getAllCollectionsUseCase = new GetAllCollections(this.repo);
  private readonly getCollectionByIdUseCase = new GetCollectionById(this.repo);
  private readonly createCollectionUseCase = new CreateCollection(this.repo);
  private readonly updateCollectionUseCase = new UpdateCollection(this.repo);
  private readonly deleteCollectionUseCase = new DeleteCollection(this.repo);

  getAllCollections: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const collections = await this.getAllCollectionsUseCase.execute();
      const dtos = collections.map(toCollectionDTO);
      sendSuccess(res, dtos, 200);
    } catch (err) {
      next(err);
    }
  };

  getCollectionById: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const collection_id = Number(req.params.collection_id);
    if (isNaN(collection_id)) {
      sendError(res, "Invalid collection collection_id", 400);
      return;
    }
    try {
      const collection =
        await this.getCollectionByIdUseCase.execute(collection_id);
      if (!collection) {
        sendError(res, "Collection not found", 404);
        return;
      }
      sendSuccess(res, toCollectionDTO(collection), 200);
    } catch (err) {
      next(err);
    }
  };

  createCollection: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { collection_date, collection_place } = req.body;
    if (!collection_date || !collection_place) {
      sendError(
        res,
        "Missing 'collection_date' or 'collection_place' in body",
        400,
      );
      return;
    }
    try {
      const created = await this.createCollectionUseCase.execute({
        collection_date: new Date(collection_date),
        collection_place,
      });
      if (!created) {
        sendError(res, "Collection already exists", 409);
        return;
      }
      sendSuccess(res, toCollectionDTO(created), 200);
    } catch (err) {
      next(err);
    }
  };

  updateCollection: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const collection_id = Number(req.params.collection_id);
    const { collection_date, collection_place } = req.body;
    if (isNaN(collection_id)) {
      sendError(res, "Invalid collection collection_id", 400);
      return;
    }
    if (!collection_date && !collection_place) {
      sendError(
        res,
        "At least one of 'collection_date' or 'collection_place' must be provided",
        400,
      );
      return;
    }
    try {
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
        sendError(res, "Collection not found", 404);
        return;
      }
      sendSuccess(res, toCollectionDTO(updated), 200);
    } catch (err) {
      next(err);
    }
  };

  deleteCollection: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const collection_id = Number(req.params.collection_id);
    if (isNaN(collection_id)) {
      sendError(res, "Invalid collection collection_id", 400);
      return;
    }
    try {
      const deleted = await this.deleteCollectionUseCase.execute(collection_id);
      if (!deleted) {
        sendError(res, "Collection not found", 404);
        return;
      }
      sendSuccess(res, null, 200);
    } catch (err) {
      next(err);
    }
  };
}
