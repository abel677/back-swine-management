import { Phase } from '../entities/phase.entity';

export interface PhaseRepository {
  getAll(userId: string): Promise<Phase[]>;
  createMany(phases: Phase[]): Promise<void>;
  getByName(dto: { name: string; farmId: string }): Promise<Phase | null>;
  getById(dto: { id: string; farmId: string }): Promise<Phase | null>;
}
