import { Column, Entity, OneToOne, Relation } from 'typeorm';
import { Order } from './order.entity';
import { BaseEntity } from '../../common/entity';

export type ShippingStatus =
  | 'ordered' // 주문 완료
  | 'shipping' // 출고 준비 중
  | 'shipped' // 출고 완료
  | 'delivering' // 배송 중
  | 'delivered'; // 배송 완료

@Entity()
export class ShippingInfo extends BaseEntity {
  @OneToOne(() => Order, (order) => order.shippingInfo)
  order: Relation<Order>;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'varchar', length: 50 })
  status: ShippingStatus;

  @Column({ type: 'varchar', length: 100, nullable: true })
  trackingNumber: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  shippingCompany: string;
}
