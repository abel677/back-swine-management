import { inject, injectable } from 'tsyringe';
import { ProductRepository } from '../../domain/ports/product.repository';

@injectable()
export class GetProductByIdUseCase {
  constructor(
    @inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string, farmId: string) {
    return await this.productRepository.getById(id, farmId);
  }
}
