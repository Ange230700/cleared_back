// src\core\entities\AuthUser.ts

import { volunteer_role } from "@prisma/client";

export class AuthUser {
  constructor(
    public volunteer_id: number,
    public volunteer_email: string,
    public volunteer_name: string,
    public role: volunteer_role,
  ) {}
}
