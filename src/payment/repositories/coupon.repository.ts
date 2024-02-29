import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Coupon } from '../entities';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CouponRepository extends Repository<Coupon> {
  constructor(
    @InjectRepository(Coupon)
    private readonly repo: Repository<Coupon>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }
}
