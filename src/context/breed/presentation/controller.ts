import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AllBreedUseCase } from '../application/use-cases/all-breed.usecase';
import { BreedMapper } from '../infrastructure/mappers/breed.mapper';
import { CreateBreedUseCase } from '../application/use-cases/create-breed.usecase';
import { CreateBreedDto } from '../application/dtos/create-breed.dto';
import { Application } from '../../../utils/http-error';
import { UpdateBreedDto } from '../application/dtos/update-breed.dto';
import { UpdateBreedUseCase } from '../application/use-cases/update-breed.usecase';

export const update = async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = (req as any).user.userId;

  const [error, dto] = UpdateBreedDto.create(req.body);
  if (error) throw Application.badRequest(error);

  const useCase = container.resolve(UpdateBreedUseCase);
  const breed = await useCase.execute(id, userId, dto!);
  res.json({
    message: 'Registro actualizado con exito.',
    breed: BreedMapper.toHttpResponse(breed),
  });
};
export const create = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  const [error, dto] = CreateBreedDto.create(req.body);
  if (error) throw Application.badRequest(error);

  const useCase = container.resolve(CreateBreedUseCase);
  const breed = await useCase.execute(userId, dto!);
  res.json({
    message: 'Registro guardado con exito.',
    breed: BreedMapper.toHttpResponse(breed),
  });
};

export const all = async (req: Request, res: Response) => {
  const id = (req as any).user.userId;
  const useCase = container.resolve(AllBreedUseCase);
  const breeds = await useCase.execute(id);
  res.json(breeds.map((breed) => BreedMapper.toHttpResponse(breed)));
};
