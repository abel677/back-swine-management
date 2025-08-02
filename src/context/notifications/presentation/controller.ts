import { CreateNotificationUseCase } from './../application/use-cases/create-notification.usecase';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AllNotificationUseCase } from '../application/use-cases/all-notification.usecase';
import { NotificationMapper } from '../infrastructure/notification.mapper';
import { CreateNotificationDto } from '../application/dtos/create-notification.dto';
import { Application } from '../../../utils/http-error';
import { MarkReadNotificationUseCase } from '../application/use-cases/mark-read-notification.usecase';

export const all = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const useCase = container.resolve(AllNotificationUseCase);
  const notifications = await useCase.execute(userId);
  res.json(notifications.map((n) => NotificationMapper.toHttpResponse(n)));
};

export const markRead = async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = (req as any).user.userId;

  const useCase = container.resolve(MarkReadNotificationUseCase);

  const notification = await useCase.execute(userId, id);
  res.json(NotificationMapper.toHttpResponse(notification));
};

export const create = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const [error, dto] = CreateNotificationDto.create(req.body);
  if (error) throw Application.badRequest(error);

  const useCase = container.resolve(CreateNotificationUseCase);
  const notification = await useCase.execute(userId, dto!);
  res.json(NotificationMapper.toHttpResponse(notification));
};
