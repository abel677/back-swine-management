import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AllUserUseCase } from '../application/use-cases/all-user.usecase';
import { Application } from '../../../utils/http-error';
import { UserMapper } from '../infrastructure/mappers/user.mapper';
import { DeleteManyUserUseCase } from '../application/use-cases/delete-many-user.usecase';
import { DeleteManyUserDto } from '../application/dtos/delete-all-user.dto';
import { GetProfileUseCase } from '../application/use-cases/get-profile.usecase';

export const profile = async (req: Request, res: Response) => {
  const id = (req as any).user.userId;

  const useCase = container.resolve(GetProfileUseCase);
  const user = await useCase.execute(id);
  res.json(UserMapper.toHttpResponse(user));
};

export const all = async (req: Request, res: Response) => {
  const useCase = container.resolve(AllUserUseCase);
  const users = await useCase.execute();
  res.json(users.map((user) => UserMapper.toHttpResponse(user)));
};

export const deleteMany = async (req: Request, res: Response) => {
  const [error, dto] = DeleteManyUserDto.create(req.body);
  if (error) {
    throw Application.badRequest(error);
  }

  const useCase = container.resolve(DeleteManyUserUseCase);
  await useCase.execute(dto!);
  res.json({
    message: 'Usuarios eliminado.',
  });
};

export const deleteOne = async (req: Request, res: Response) => {
  const id = req.params.id;

  const useCase = container.resolve(DeleteManyUserUseCase);
  await useCase.execute({ users: [{ id }] });
  res.json({
    message: 'Usuario eliminado.',
  });
};
