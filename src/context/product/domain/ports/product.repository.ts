import { Product } from '../entities/product.entity';

export interface ProductRepository {
  getById(id: string, farmId: string): Promise<Product | null>;
  getByIdAndUserId(id: string, userId: string): Promise<Product | null>;
  save(product: Product): Promise<void>;
  getByName(name: string, farmId: string): Promise<Product | null>;
  all(userId: string): Promise<Product[]>;
}
