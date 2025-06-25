// src\application\useCases\GetVolunteerById.ts

import { IVolunteerRepository } from "~/src/application/interfaces/IVolunteerRepository";
import { Volunteer } from "~/src/core/entities/Volunteer";
export class GetVolunteerById {
  constructor(private readonly repo: IVolunteerRepository) {}
  async execute(volunteer_id: number): Promise<Volunteer | null> {
    return this.repo.getVolunteerById(volunteer_id);
  }
}
