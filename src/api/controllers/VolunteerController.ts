// src\api\controllers\VolunteerController.ts

import { RequestHandler, Request, Response, NextFunction } from "express";
import { VolunteerRepository } from "~/src/infrastructure/repositories/VolunteerRepository";
import { GetAllVolunteers } from "~/src/application/useCases/volunteer/GetAllVolunteers";
import { GetVolunteerById } from "~/src/application/useCases/volunteer/GetVolunteerById";
import { CreateVolunteer } from "~/src/application/useCases/volunteer/CreateVolunteer";
import { UpdateVolunteer } from "~/src/application/useCases/volunteer/UpdateVolunteer";
import { DeleteVolunteer } from "~/src/application/useCases/volunteer/DeleteVolunteer";
import { sendSuccess, sendError } from "~/src/api/helpers/sendResponse";
import { toVolunteerDTO } from "~/src/api/dto";

export class VolunteerController {
  private readonly repo = new VolunteerRepository();
  private readonly getAllUseCase = new GetAllVolunteers(this.repo);
  private readonly getByIdUseCase = new GetVolunteerById(this.repo);
  private readonly createUseCase = new CreateVolunteer(this.repo);
  private readonly updateUseCase = new UpdateVolunteer(this.repo);
  private readonly deleteUseCase = new DeleteVolunteer(this.repo);

  getAllVolunteers: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const items = await this.getAllUseCase.execute();
      const dtos = items.map(toVolunteerDTO);
      sendSuccess(res, dtos, 200);
    } catch (err) {
      next(err);
    }
  };

  getVolunteerById: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const volunteer_id = Number(req.params.volunteer_id);
    if (isNaN(volunteer_id)) {
      sendError(res, "Invalid id", 400);
      return;
    }
    try {
      const item = await this.getByIdUseCase.execute(volunteer_id);
      if (!item) {
        sendError(res, "Not found", 404);
        return;
      }
      sendSuccess(res, toVolunteerDTO(item), 200);
    } catch (err) {
      next(err);
    }
  };

  createVolunteer: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { volunteer_name, volunteer_email, password, role } = req.body;
    if (!volunteer_name || !volunteer_email || !password) {
      sendError(res, "Missing required fields", 400);
      return;
    }
    try {
      const created = await this.createUseCase.execute({
        volunteer_name,
        volunteer_email,
        password,
        role,
      });
      if (!created) {
        sendError(res, "Volunteer already exists", 409);
        return;
      }
      sendSuccess(res, toVolunteerDTO(created), 200);
    } catch (err) {
      next(err);
    }
  };

  updateVolunteer: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const volunteer_id = Number(req.params.volunteer_id);
    if (isNaN(volunteer_id)) {
      sendError(res, "Invalid id", 400);
      return;
    }
    const { volunteer_name, volunteer_email, password, role } = req.body;
    if (
      volunteer_name === undefined &&
      volunteer_email === undefined &&
      password === undefined &&
      role === undefined
    ) {
      sendError(res, "No fields to update", 400);
      return;
    }
    try {
      const updated = await this.updateUseCase.execute(volunteer_id, {
        volunteer_name,
        volunteer_email,
        password,
        role,
      });
      if (!updated) {
        sendError(res, "Not found", 404);
        return;
      }
      sendSuccess(res, toVolunteerDTO(updated), 200);
    } catch (err) {
      next(err);
    }
  };

  deleteVolunteer: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const volunteer_id = Number(req.params.volunteer_id);
    if (isNaN(volunteer_id)) {
      sendError(res, "Invalid id", 400);
      return;
    }
    try {
      const deleted = await this.deleteUseCase.execute(volunteer_id);
      if (!deleted) {
        sendError(res, "Not found", 404);
        return;
      }
      sendSuccess(res, null, 200);
    } catch (err) {
      next(err);
    }
  };
}
