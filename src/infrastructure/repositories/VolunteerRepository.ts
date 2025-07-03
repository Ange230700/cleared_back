// src\infrastructure\repositories\VolunteerRepository.ts

import { Volunteer } from "~/src/core/entities/Volunteer";
import { IVolunteerRepository } from "~/src/application/interfaces/IVolunteerRepository";
import prisma from "~/prisma/lib/client";
import { Prisma, volunteer_role } from "@prisma/client";
import argon2 from "argon2";

export class VolunteerRepository implements IVolunteerRepository {
  async getAllVolunteers(): Promise<Volunteer[]> {
    const items = await prisma.volunteer.findMany();
    return items.map(
      (v) =>
        new Volunteer(
          Number(v.volunteer_id),
          v.volunteer_name,
          v.volunteer_email,
          v.password,
          v.role,
        ),
    );
  }

  async getVolunteerById(volunteer_id: number): Promise<Volunteer | null> {
    const v = await prisma.volunteer.findUnique({
      where: { volunteer_id: BigInt(volunteer_id) },
    });
    if (!v) return null;
    return new Volunteer(
      Number(v.volunteer_id),
      v.volunteer_name,
      v.volunteer_email,
      v.password,
      v.role,
    );
  }

  async createVolunteer(data: {
    volunteer_name: string;
    volunteer_email: string;
    password: string;
    role?: volunteer_role;
  }): Promise<Volunteer> {
    const hashed = await argon2.hash(data.password);

    const created = await prisma.volunteer.create({
      data: {
        volunteer_name: data.volunteer_name,
        volunteer_email: data.volunteer_email,
        password: hashed,
        role: data.role ?? volunteer_role.attendee,
      },
    });
    return new Volunteer(
      Number(created.volunteer_id),
      created.volunteer_name,
      created.volunteer_email,
      created.password,
      created.role,
    );
  }

  async updateVolunteer(
    volunteer_id: number,
    data: {
      volunteer_name?: string;
      volunteer_email?: string;
      password?: string;
      role?: volunteer_role;
    },
  ): Promise<Volunteer | null> {
    try {
      let hashedPassword: string | undefined;
      if (data.password) {
        hashedPassword = await argon2.hash(data.password);
      }

      const updated = await prisma.volunteer.update({
        where: { volunteer_id: BigInt(volunteer_id) },
        data: {
          ...(data.volunteer_name && { volunteer_name: data.volunteer_name }),
          ...(data.volunteer_email && {
            volunteer_email: data.volunteer_email,
          }),
          ...(data.password && { password: hashedPassword }),
          ...(data.role && { role: data.role }),
        },
      });
      return new Volunteer(
        Number(updated.volunteer_id),
        updated.volunteer_name,
        updated.volunteer_email,
        updated.password,
        updated.role,
      );
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      )
        return null;
      throw e;
    }
  }

  async deleteVolunteer(volunteer_id: number): Promise<boolean> {
    try {
      await prisma.volunteer.delete({
        where: { volunteer_id: BigInt(volunteer_id) },
      });
      return true;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      )
        return false;
      throw e;
    }
  }
}
