import { Breed } from '../breed.entity';

export interface BreedRepository {
  getByIdAndUserId(id: string, userId: string): Promise<Breed | null>;
  getById(id: string, farmId: string): Promise<Breed | null>;
  getByName(name: string, farmId: string): Promise<Breed | null>;
  all(userId: string): Promise<Breed[]>;
  save(farm: Breed): Promise<void>;
  createMany(breeds: Breed[]): Promise<void>;
}
