import { Injectable } from '@nestjs/common';
import { Product } from '../entities';
import { ProductRepository } from '../repositories';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getProductsByIds(productIds: string[]): Promise<Product[]> {
    return await this.productRepository.getProductsByIds(productIds);
  }
}
