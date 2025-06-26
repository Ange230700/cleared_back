// src\application\useCases\volunteer\CreateVolunteer.ts

import { IVolunteerRepository } from "~/src/application/interfaces/IVolunteerRepository";
import { Volunteer } from "~/src/core/entities/Volunteer";
import { volunteer_role } from "@prisma/client";
export class CreateVolunteer {
  constructor(private readonly repo: IVolunteerRepository) {}
  async execute(data: {
    volunteer_name: string;
    volunteer_email: string;
    password: string;
    role?: volunteer_role;
  }): Promise<Volunteer> {
    return this.repo.createVolunteer(data);
  }
}
