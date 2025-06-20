import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateCategoryUseCase } from '../application/use-cases/create-category.usecase';
import { AllCategoryUseCase } from '../application/use-cases/all-category.usecase';
import { CategoryMapper } from '../infrastructure/mappers/category.mapper';
import { CreateCategoryDto } from '../application/dtos/create-category.dto';
import { Application } from '../../../utils/http-error';
import { UpdateCategoryDto } from '../application/dtos/update-category.dto';
import { UpdateCategoryUseCase } from '../application/use-cases/update-category.usecase';

export const update = async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = (req as any).user.userId;
  const [error, dto] = UpdateCategoryDto.create(req.body);
  if (error) throw Application.badRequest(error);
  const usecase = container.resolve(UpdateCategoryUseCase);
  const category = await usecase.execute(id, userId, dto!);
  res.json({
    message: 'Registro actualizado con exito.',
    category: CategoryMapper.toHttpResponse(category),
  });
};

export const create = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const [error, dto] = CreateCategoryDto.create(req.body);
  if (error) throw Application.badRequest(error);
  const usecase = container.resolve(CreateCategoryUseCase);
  const category = await usecase.execute(userId, dto!);
  res.json({
    message: 'Registro guardado con exito.',
    category: CategoryMapper.toHttpResponse(category),
  });
};

export const all = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const usecase = container.resolve(AllCategoryUseCase);
  const categories = await usecase.execute(userId);
  res.json(categories.map((c) => CategoryMapper.toHttpResponse(c)));
};
