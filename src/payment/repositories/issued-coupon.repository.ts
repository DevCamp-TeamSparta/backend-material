import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { IssuedCoupon } from '../entities';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class IssuedCouponRepository extends Repository<IssuedCoupon> {
  constructor(
    @InjectRepository(IssuedCoupon)
    private readonly repo: Repository<IssuedCoupon>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  use(issuedCoupon: IssuedCoupon): Promise<IssuedCoupon> {
    issuedCoupon.use();
    return this.save(issuedCoupon);
  }
}
