import { Category } from '../entities/category.entity';

export interface CategoryRepository {
  getByIdAnUserId(id: string, userId: string): Promise<Category | null>;
  getById(id: string, farmId: string): Promise<Category | null>;
  save(category: Category): Promise<void>;
  getByName(name: string, farmId: string): Promise<Category | null>;
  all(userId: string): Promise<Category[]>;
  createMany(categories: Category[]): Promise<void>;
}
