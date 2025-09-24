import { Request, Response } from 'express';
import { CreatePigDto } from '../application/dtos/create-pig.dto';
import { Application } from '../../../utils/http-error';
import { container } from 'tsyringe';
import { CreatePigUseCase } from '../application/use-cases/create-pig.usecase';
import { PigMapper } from '../infrastructure/mappers/pig.mapper';
import { AllPigUseCase } from '../application/use-cases/all-pig.usecase';
import { UpdatePigDto } from '../application/dtos/update-pig.dto';
import { UpdatePigUseCase } from '../application/use-cases/update-pig.usecase';
import { DeletePigUseCase } from '../application/use-cases/delete-pig.usecase';

export const all = async (req: Request, res: Response) => {
  const id = (req as any).user.userId;

  const useCase = container.resolve(AllPigUseCase);
  const pigs = await useCase.execute(id);
  res.json(pigs.map((pig) => PigMapper.toHttpResponse(pig)));
};

export const remove = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const id = req.params.id;
  if (!id) throw Application.badRequest('ID cerdo requerido.');

  const useCase = container.resolve(DeletePigUseCase);
  const result = await useCase.execute({ userId, id });
  res.json({
    message: 'Registro eliminado con exito.',
  });
};

export const update = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const id = req.params.id;

  const [error, dto] = UpdatePigDto.create(req.body);
  if (error) throw Application.badRequest(error);

  const useCase = container.resolve(UpdatePigUseCase);
  const result = await useCase.execute(userId, id, dto!);
  res.json({
    message: 'Registro actualizado con exito.',
    pig: PigMapper.toHttpResponse(result),
  });
};

export const create = async (req: Request, res: Response) => {
  const id = (req as any).user.userId;

  const [error, dto] = CreatePigDto.create(req.body);
  if (error) throw Application.badRequest(error);

  const useCase = container.resolve(CreatePigUseCase);
  const result = await useCase.execute(id, dto!);
  res.json({
    message: 'Registro guardado con exito.',
    pig: PigMapper.toHttpResponse(result),
  });
};
