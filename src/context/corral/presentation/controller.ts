import { UpdateCorralDto } from './../application/dtos/update-corral.dto';
import { Request, Response } from 'express';
import { CreateCorralDto } from '../application/dtos/create-corral.dto';
import { Application } from '../../../utils/http-error';
import { container } from 'tsyringe';
import { CreateCorralUseCase } from '../application/use-cases/create-corral.usecase';
import { CorralMapper } from '../infrastructure/mappers/corral.mapper';
import { UpdateCorralUseCase } from '../application/use-cases/update-corral.usecase';
import { AllCorralUseCase } from '../application/use-cases/all-corral.usecase';

export const all = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const useCase = container.resolve(AllCorralUseCase);
  const corrals = await useCase.execute(userId);
  res.json(corrals.map((corral) => CorralMapper.toHttpResponse(corral)));
};

export const update = async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = (req as any).user.userId;
  const [error, dto] = UpdateCorralDto.create(req.body);
  if (error) throw Application.badRequest(error);

  const useCase = container.resolve(UpdateCorralUseCase);
  const corral = await useCase.execute(id, userId, dto!);
  res.json({
    message: 'Registro actualizado con exito.',
    corral: CorralMapper.toHttpResponse(corral),
  });
};

export const create = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const [error, dto] = CreateCorralDto.create(req.body);
  if (error) throw Application.badRequest(error);

  const useCase = container.resolve(CreateCorralUseCase);
  const corral = await useCase.execute(userId, dto!);
  res.json({
    message: 'Registro guardado con exito.',
    corral: CorralMapper.toHttpResponse(corral),
  });
};
