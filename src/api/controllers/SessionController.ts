// src\api\controllers\SessionController.ts

import { RequestHandler, Request, Response, NextFunction } from "express";
import { SessionRepository } from "~/src/infrastructure/repositories/SessionRepository";
import { GetAllSessions } from "~/src/application/useCases/session/GetAllSessions";
import { GetSessionById } from "~/src/application/useCases/session/GetSessionById";
import { CreateSession } from "~/src/application/useCases/session/CreateSession";
import { DeleteSession } from "~/src/application/useCases/session/DeleteSession";
import { sendSuccess, sendError } from "~/src/api/helpers/sendResponse";
import { toSessionDTO } from "~/src/api/dto";

export class SessionController {
  private readonly repo = new SessionRepository();
  private readonly getAllUseCase = new GetAllSessions(this.repo);
  private readonly getByIdUseCase = new GetSessionById(this.repo);
  private readonly createUseCase = new CreateSession(this.repo);
  private readonly deleteUseCase = new DeleteSession(this.repo);

  getAllSessions: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const sessions = await this.getAllUseCase.execute();
      const dtos = sessions.map(toSessionDTO);
      sendSuccess(res, dtos, 200);
    } catch (err) {
      next(err);
    }
  };

  getSessionById: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const token_id = req.params.token_id;
    if (!token_id) {
      sendError(res, "Missing token_id", 400);
      return;
    }
    try {
      const session = await this.getByIdUseCase.execute(token_id);
      if (!session) {
        sendError(res, "Session not found", 404);
        return;
      }
      sendSuccess(res, toSessionDTO(session), 200);
    } catch (err) {
      next(err);
    }
  };

  createSession: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { token_id, volunteer_id, issued_at, expires_at } = req.body;
    if (!token_id || !volunteer_id || !issued_at || !expires_at) {
      sendError(res, "Missing required fields", 400);
      return;
    }
    try {
      const session = await this.createUseCase.execute({
        token_id,
        volunteer_id,
        issued_at: new Date(issued_at),
        expires_at: new Date(expires_at),
      });
      sendSuccess(res, toSessionDTO(session), 201);
    } catch (err) {
      next(err);
    }
  };

  deleteSession: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const token_id = req.params.token_id;
    if (!token_id) {
      sendError(res, "Missing token_id", 400);
      return;
    }
    try {
      const deleted = await this.deleteUseCase.execute(token_id);
      if (!deleted) {
        sendError(res, "Session not found", 404);
        return;
      }
      sendSuccess(res, null, 204);
    } catch (err) {
      next(err);
    }
  };
}
