// src\application\useCases\GetAllVolunteers.ts

import { IVolunteerRepository } from "~/src/application/interfaces/IVolunteerRepository";
import { Volunteer } from "~/src/core/entities/Volunteer";
export class GetAllVolunteers {
  constructor(private readonly repo: IVolunteerRepository) {}
  async execute(): Promise<Volunteer[]> {
    return this.repo.getAllVolunteers();
  }
}
