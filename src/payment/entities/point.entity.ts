import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';
import { BaseEntity } from '../../common/entity';
import { PointLog } from './point-log.entity';
import { User } from '../../auth/entities';

@Entity()
export class Point extends BaseEntity {
  @OneToOne(() => User, (user) => user.point)
  @JoinColumn()
  user: Relation<User>;

  @Column({ type: 'int' })
  availableAmount: number;

  @OneToMany(() => PointLog, (pointLog) => pointLog.amount)
  logs: Relation<PointLog[]>;

  use(amountToUse: number) {
    this.availableAmount -= amountToUse;
  }
}
