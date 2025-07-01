import { inject, injectable } from 'tsyringe';
import { ProductRepository } from '../../domain/ports/product.repository';

@injectable()
export class GetProductByNameUseCase {
  constructor(
    @inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(name: string, farmId: string) {
    return await this.productRepository.getByName(name, farmId);
  }
}
