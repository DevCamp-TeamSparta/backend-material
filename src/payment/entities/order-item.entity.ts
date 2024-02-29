import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { Order } from './order.entity';
import { BaseEntity } from '../../common/entity';

@Entity()
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.items)
  order: Relation<Order>;

  @Column()
  productId: string;

  @Column()
  quantity: number;
}
