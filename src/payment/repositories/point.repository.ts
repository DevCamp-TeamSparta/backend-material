import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Point } from '../entities';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { PointLogRepository } from './point-log.repository';

@Injectable()
export class PointRepository extends Repository<Point> {
  constructor(
    @InjectRepository(Point)
    private readonly repo: Repository<Point>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly pointLogRepository: PointLogRepository,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async use(userId, amountToUse: number, reason: string): Promise<Point> {
    const point = await this.findOne({ where: { user: { id: userId } } });
    point.use(amountToUse);
    await this.pointLogRepository.use(point, amountToUse, reason);
    return this.save(point);
  }
}
