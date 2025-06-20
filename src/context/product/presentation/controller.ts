import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateProductUseCase } from '../application/use-cases/create-product.usecase';
import { AllProductUseCase } from '../application/use-cases/all-product.usecase';
import { CreateProductDto } from '../application/dtos/create-product.dto';
import { Application } from '../../../utils/http-error';
import { ProductMapper } from '../infrastructure/mappers/product.mapper';
import { UpdateProductDto } from '../application/dtos/update-product.dto';
import { UpdateProductUseCase } from '../application/use-cases/update-product.usecase';

export const update = async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = (req as any).user.userId;

  const [error, dto] = UpdateProductDto.create(req.body);
  if (error) throw Application.badRequest(error);
  const usecase = container.resolve(UpdateProductUseCase);
  const product = await usecase.execute(userId, id, dto!);
  res.json({
    message: 'Registro actualizado con exito.',
    product: ProductMapper.toHttpResponse(product),
  });
};

export const create = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const [error, dto] = CreateProductDto.create(req.body);
  if (error) throw Application.badRequest(error);
  const usecase = container.resolve(CreateProductUseCase);
  const product = await usecase.execute(userId, dto!);
  res.json({
    message: 'Registro guardado con exito.',
    product: ProductMapper.toHttpResponse(product),
  });
};

export const all = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const usecase = container.resolve(AllProductUseCase);
  const products = await usecase.execute(userId);
  res.json(products.map((p) => ProductMapper.toHttpResponse(p)));
};
