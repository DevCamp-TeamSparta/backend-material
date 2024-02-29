import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Relation,
} from 'typeorm';
import { BaseEntity } from '../../common/entity';
import { Coupon } from './coupon.entity';
import { User } from '../../auth/entities';
import { Order } from './order.entity';

@Entity()
export class IssuedCoupon extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn()
  user: Relation<User>;

  @ManyToOne(() => Coupon)
  @JoinColumn()
  coupon: Relation<Coupon>;

  @OneToOne(() => Order, (order) => order.usedIssuedCoupon, { nullable: true })
  usedOrder: Relation<Order>;

  @Column({ type: 'boolean', default: false })
  isValid: boolean;

  @Column({ type: 'timestamp', nullable: false })
  validFrom: Date;

  @Column({ type: 'timestamp', nullable: false })
  validUntil: Date;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  usedAt: Date;

  use() {
    this.isUsed = true;
    this.isValid = false;
    this.usedAt = new Date();
  }
}
