import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateDeviceDto } from '../application/dtos/create-device.dto';
import { Application } from '../../../utils/http-error';
import { CreateDeviceUseCase } from '../application/use-cases/create-device.usecase';
import { DeviceMapper } from '../infrastructure/mappers/device.mapper';

export const create = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const [error, dto] = CreateDeviceDto.create(req.body);
  if (error) throw Application.badRequest(error);
  const useCase = container.resolve(CreateDeviceUseCase);
  const device = await useCase.execute(userId, dto!);
  res.json(DeviceMapper.toHttpResponse(device));
};
