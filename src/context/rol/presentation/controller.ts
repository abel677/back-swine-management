import { container } from 'tsyringe';
import { AllRolUseCase } from '../application/use-cases/all-rol.usecase';
import { RolMapper } from '../infrastructure/mappers/rol.mapper';
import { Request, Response } from 'express';

export const all = async (req: Request, res: Response) => {
  const useCase = container.resolve(AllRolUseCase);
  const roles = await useCase.execute();
  res.json(roles.map((rol) => RolMapper.toHttpResponse(rol)));
};
