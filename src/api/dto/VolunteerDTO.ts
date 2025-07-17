// src/api/dto/VolunteerDTO.ts

import { volunteer_role } from "@prisma/client";
import { AuthUser } from "~/src/core/entities/AuthUser";
import { Volunteer } from "~/src/core/entities/Volunteer";

export interface VolunteerDTO {
  volunteer_id: number;
  volunteer_name: string;
  volunteer_email: string;
  role: volunteer_role;
}

// Mapper function
export function toVolunteerDTO(entity: Volunteer | AuthUser): VolunteerDTO {
  return {
    volunteer_id: entity.volunteer_id,
    volunteer_name: entity.volunteer_name,
    volunteer_email: entity.volunteer_email,
    role: entity.role,
  };
}
