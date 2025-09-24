import { Pig } from '../entities/pig.entity';

export interface PigRepository {
  delete(id: string): Promise<void>;
  all(userId: string): Promise<Pig[]>;
  save(pig: Pig): Promise<void>;
  getById(id: string, farmId: string): Promise<Pig | null>;
  getByIds(
    ids: {
      id: string;
    }[],
    farmId: string,
  ): Promise<Pig[]>;
  getByIdAndUserId(id: string, userId: string): Promise<Pig | null>;
  getByEarTag(earTag: string, farmId: string): Promise<Pig | null>;
}
