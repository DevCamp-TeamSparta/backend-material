import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Point, PointLog } from '../entities';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PointLogRepository extends Repository<PointLog> {
  constructor(
    @InjectRepository(PointLog)
    private readonly repo: Repository<PointLog>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  use(point: Point, amountToUse: number, reason: string): Promise<PointLog> {
    const pointLog = new PointLog();
    pointLog.point = point;
    pointLog.use(amountToUse, reason);
    return this.save(pointLog);
  }
}
