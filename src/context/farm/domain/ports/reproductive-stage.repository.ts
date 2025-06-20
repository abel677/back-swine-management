import { ReproductiveStage } from '../entities/reproductive-stage.entity';

export interface ReproductiveStageRepository {
  createMany(reproductiveStage: ReproductiveStage[]): Promise<void>;
  getAll(userId: string): Promise<ReproductiveStage[]>;
  getByName(name: string): Promise<ReproductiveStage | null>;
  getById(dto: {
    id: string;
    farmId: string;
  }): Promise<ReproductiveStage | null>;
}
