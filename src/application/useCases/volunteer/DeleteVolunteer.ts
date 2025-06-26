// src\application\useCases\volunteer\DeleteVolunteer.ts

import { IVolunteerRepository } from "~/src/application/interfaces/IVolunteerRepository";
export class DeleteVolunteer {
  constructor(private readonly repo: IVolunteerRepository) {}
  async execute(volunteer_id: number): Promise<boolean> {
    return this.repo.deleteVolunteer(volunteer_id);
  }
}
