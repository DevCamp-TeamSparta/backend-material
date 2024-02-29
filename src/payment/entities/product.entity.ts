import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entity';

export type ProductStatus = 'available' | 'out-of-stock';

@Entity()
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  category: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  imageUrl: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'available' })
  status: ProductStatus;
}
