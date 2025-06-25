// src\api\controllers\VolunteerController.ts

import { RequestHandler } from "express";
import { VolunteerRepository } from "~/src/infrastructure/repositories/VolunteerRepository";
import { GetAllVolunteers } from "~/src/application/useCases/GetAllVolunteers";
import { GetVolunteerById } from "~/src/application/useCases/GetVolunteerById";
import { CreateVolunteer } from "~/src/application/useCases/CreateVolunteer";
import { UpdateVolunteer } from "~/src/application/useCases/UpdateVolunteer";
import { DeleteVolunteer } from "~/src/application/useCases/DeleteVolunteer";
import { toJSONSafe } from "~/src/utils/bigint-to-number";

export class VolunteerController {
  private readonly getAllUseCase = new GetAllVolunteers(
    new VolunteerRepository(),
  );
  private readonly getByIdUseCase = new GetVolunteerById(
    new VolunteerRepository(),
  );
  private readonly createUseCase = new CreateVolunteer(
    new VolunteerRepository(),
  );
  private readonly updateUseCase = new UpdateVolunteer(
    new VolunteerRepository(),
  );
  private readonly deleteUseCase = new DeleteVolunteer(
    new VolunteerRepository(),
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAllVolunteers: RequestHandler = async (req, res, next) => {
    try {
      const items = await this.getAllUseCase.execute();
      res.status(200).json(toJSONSafe(items));
    } catch (e) {
      console.error("❌ [VolunteerController] getAllVolunteers error:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getVolunteerById: RequestHandler = async (req, res, next) => {
    try {
      const volunteer_id = Number(req.params.volunteer_id);
      if (isNaN(volunteer_id)) {
        res.status(400).json({ error: "Invalid id" });
        return;
      }
      const item = await this.getByIdUseCase.execute(volunteer_id);
      if (!item) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.status(200).json(toJSONSafe(item));
    } catch (e) {
      console.error("❌ [VolunteerController] getVolunteerById error:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createVolunteer: RequestHandler = async (req, res, next) => {
    try {
      const { volunteer_name, volunteer_email, password, role } = req.body;
      if (!volunteer_name || !volunteer_email || !password) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
      const item = await this.createUseCase.execute({
        volunteer_name,
        volunteer_email,
        password,
        role,
      });
      res.status(201).json(toJSONSafe(item));
    } catch (e) {
      console.error("❌ [VolunteerController] createVolunteer error:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateVolunteer: RequestHandler = async (req, res, next) => {
    try {
      const volunteer_id = Number(req.params.volunteer_id);
      if (isNaN(volunteer_id)) {
        res.status(400).json({ error: "Invalid id" });
        return;
      }
      const { volunteer_name, volunteer_email, password, role } = req.body;
      if (
        volunteer_name === undefined &&
        volunteer_email === undefined &&
        password === undefined &&
        role === undefined
      ) {
        res.status(400).json({ error: "No fields to update" });
        return;
      }
      const item = await this.updateUseCase.execute(volunteer_id, {
        volunteer_name,
        volunteer_email,
        password,
        role,
      });
      if (!item) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.status(200).json(toJSONSafe(item));
    } catch (e) {
      console.error("❌ [VolunteerController] updateVolunteer error:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteVolunteer: RequestHandler = async (req, res, next) => {
    try {
      const volunteer_id = Number(req.params.volunteer_id);
      if (isNaN(volunteer_id)) {
        res.status(400).json({ error: "Invalid id" });
        return;
      }
      const deleted = await this.deleteUseCase.execute(volunteer_id);
      if (!deleted) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.status(204).send();
    } catch (e) {
      console.error("❌ [VolunteerController] deleteVolunteer error:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
