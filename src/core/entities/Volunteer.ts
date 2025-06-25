// src\core\entities\Volunteer.ts

import { volunteer_role } from "@prisma/client";
export class Volunteer {
  constructor(
    public volunteer_id: number,
    public volunteer_name: string,
    public volunteer_email: string,
    public password: string,
    public role: volunteer_role,
  ) {}
}
