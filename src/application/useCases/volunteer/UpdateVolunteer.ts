// src\application\useCases\volunteer\UpdateVolunteer.ts

import { IVolunteerRepository } from "~/src/application/interfaces/IVolunteerRepository";
import { Volunteer } from "~/src/core/entities/Volunteer";
import { volunteer_role } from "@prisma/client";
export class UpdateVolunteer {
  constructor(private readonly repo: IVolunteerRepository) {}
  async execute(
    volunteer_id: number,
    data: {
      volunteer_name?: string;
      volunteer_email?: string;
      password?: string;
      role?: volunteer_role;
    },
  ): Promise<Volunteer | null> {
    return this.repo.updateVolunteer(volunteer_id, data);
  }
}
