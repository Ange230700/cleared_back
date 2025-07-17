// src/api/dto/SessionDTO.ts

import { Session } from "~/src/core/entities/Session";

export interface SessionDTO {
  token_id: string;
  volunteer_id: number;
  issued_at: string; // ISO string
  expires_at: string; // ISO string
}

export function toSessionDTO(entity: Session): SessionDTO {
  return {
    token_id: entity.token_id,
    volunteer_id: entity.volunteer_id,
    issued_at: entity.issued_at.toISOString(),
    expires_at: entity.expires_at.toISOString(),
  };
}
