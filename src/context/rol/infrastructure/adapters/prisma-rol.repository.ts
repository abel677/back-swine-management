import { inject, injectable } from 'tsyringe';
import { RolRepository } from '../../domain/ports/rol.repository';
import { PrismaClient } from '@prisma/client';
import { Rol } from '../../domain/entities/rol.entity';

@injectable()
export class PrismaRolRepository implements RolRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  async all(): Promise<Rol[]> {
    const roles = await this.prisma.role.findMany();
    return roles.map((rol) => Rol.toDomain(rol));
  }

  async getByNames(names: { name: string }[]): Promise<Rol[]> {
    const nameList = names.map((r) => r.name);
    const roles = await this.prisma.role.findMany({
      where: {
        name: {
          in: nameList,
        },
      },
    });

    return roles.map((rol) => Rol.toDomain(rol));
  }

  async getByIds(ids: { id: string }[]): Promise<Rol[]> {
    const idList = ids.map((r) => r.id);
    const roles = await this.prisma.role.findMany({
      where: {
        id: {
          in: idList,
        },
      },
    });

    return roles.map((rol) => Rol.toDomain(rol));
  }
}
