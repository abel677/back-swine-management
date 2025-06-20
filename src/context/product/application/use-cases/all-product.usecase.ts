import { inject, injectable } from 'tsyringe';
import { ProductRepository } from '../../domain/ports/product.repository';

@injectable()
export class AllProductUseCase {
  constructor(
    @inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(userId: string) {
    return await this.productRepository.all(userId);
  }
}
