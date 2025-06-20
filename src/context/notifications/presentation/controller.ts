import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AllNotificationUseCase } from '../application/use-cases/all-notification.usecase';
import { NotificationMapper } from '../infrastructure/notification.mapper';

export const all = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const useCase = container.resolve(AllNotificationUseCase);
  const notifications = await useCase.execute(userId);
  res.json(notifications.map((n) => NotificationMapper.toHttpResponse(n)));
};

export const update = async (req: Request, res: Response) => {};

export const create = async (req: Request, res: Response) => {};
