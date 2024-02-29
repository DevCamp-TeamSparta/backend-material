import { Injectable } from '@nestjs/common';
import { EntityManager, In, Repository } from 'typeorm';
import { Product } from '../entities';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async getProductsByIds(productIds: string[]): Promise<Product[]> {
    return await this.findBy({
      id: In(productIds),
    });
  }
}
