// src\application\interfaces\IVolunteerRepository.ts

import { Volunteer } from "~/src/core/entities/Volunteer";
import { volunteer_role } from "@prisma/client";

export interface IVolunteerRepository {
  getAllVolunteers(): Promise<Volunteer[]>;
  getVolunteerById(volunteer_id: number): Promise<Volunteer | null>;
  createVolunteer(data: {
    volunteer_name: string;
    volunteer_email: string;
    password: string;
    role?: volunteer_role;
  }): Promise<Volunteer>;
  updateVolunteer(
    volunteer_id: number,
    data: {
      volunteer_name?: string;
      volunteer_email?: string;
      password?: string;
      role?: volunteer_role;
    },
  ): Promise<Volunteer | null>;
  deleteVolunteer(volunteer_id: number): Promise<boolean>;
}
