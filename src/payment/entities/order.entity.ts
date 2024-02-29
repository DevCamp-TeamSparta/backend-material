import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { ShippingInfo } from './shipping-info.entity';
import { BaseEntity } from '../../common/entity';
import { User } from '../../auth/entities';
import { IssuedCoupon } from './issued-coupon.entity';

export type OrderStatus = 'started' | 'paid' | 'refunded';

@Entity()
export class Order extends BaseEntity {
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column({ type: 'varchar' })
  orderNo: string;

  @Column()
  amount: number;

  @Column({ type: 'varchar', length: 100 })
  status: OrderStatus;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: Relation<OrderItem[]>;

  @Column({ type: 'int', default: 0 })
  pointAmountUsed: number;

  @OneToOne(() => IssuedCoupon, (issuedCoupon) => issuedCoupon.usedOrder, {
    nullable: true,
  })
  @JoinColumn()
  usedIssuedCoupon: Relation<IssuedCoupon>;

  @OneToOne(() => ShippingInfo, (shippingInfo) => shippingInfo.order, {
    nullable: true,
  })
  @JoinColumn()
  shippingInfo: Relation<ShippingInfo>;

  @Column({ type: 'text', nullable: true })
  refundReason: string;

  @Column({ type: 'decimal', nullable: true })
  refundedAmount: number;

  @Column({ type: 'timestamp', nullable: true })
  refundedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  pgMetadata: any; // PG사 메타데이터

  constructor() {
    super();
    this.setOrderNo();
  }

  setOrderNo() {
    const date = new Date();
    const dateFormat = `${date.getFullYear()}${String(
      date.getMonth() + 1,
    ).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(
      date.getHours(),
    ).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(
      date.getSeconds(),
    ).padStart(2, '0')}`;
    const randomString = Array.from(
      { length: 15 },
      () => Math.random().toString(36)[2] || '0',
    ).join('');
    this.orderNo = `${dateFormat}_${randomString.toUpperCase()}`;
  }
}
