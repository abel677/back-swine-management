import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AllFarmUseCase } from '../application/use-cases/all-farm.usecase';
import { FarmMapper } from '../infrastructure/mappers/farm.mapper';
import { ReproductiveStageMapper } from '../infrastructure/mappers/reproductive-state.mapper';
import { AllSettingUseCase } from '../application/use-cases/settings/all-settings.usecase';
import { SettingMapper } from '../infrastructure/mappers/setting.mapper';
import { AllReproductiveStageUseCase } from '../application/use-cases/reproductive-stage/all-reproductive-stage.usecase';
import { AllPhaseUseCase } from '../application/use-cases/phases/all-phase-by.usecase';
import { PhaseMapper } from '../infrastructure/mappers/phase.mapper';
import { UpdateSettingUseCase } from '../application/use-cases/settings/update-settings.usecase';
import { UpdateSettingDto } from '../application/dtos/update-setting.usecase';
import { Application } from '../../../utils/http-error';

export const all = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const useCase = container.resolve(AllFarmUseCase);
  const farms = await useCase.execute(userId);
  res.json(farms.map((farm) => FarmMapper.toHttpResponse(farm)));
};

export const allPhases = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const useCase = container.resolve(AllPhaseUseCase);
  const phases = await useCase.execute(userId);
  res.json(phases.map((phase) => PhaseMapper.toHttpResponse(phase)));
};

export const allReproductiveState = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const useCase = container.resolve(AllReproductiveStageUseCase);
  const reproductiveState = await useCase.execute(userId);
  res.json(
    reproductiveState.map((rs) => ReproductiveStageMapper.toHttpResponse(rs)),
  );
};

export const updateSettings = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const useCase = container.resolve(UpdateSettingUseCase);
  const [error, dto] = UpdateSettingDto.create(req.body);
  if (error) throw Application.badRequest(error);
  const setting = await useCase.execute(userId, dto!);
  res.json(SettingMapper.toHttpResponse(setting));
};

export const allSettings = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const useCase = container.resolve(AllSettingUseCase);
  const settings = await useCase.execute(userId);
  res.json(settings.map((setting) => SettingMapper.toHttpResponse(setting)));
};
