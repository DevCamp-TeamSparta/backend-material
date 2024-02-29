import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { BaseEntity } from '../../common/entity';
import { IssuedCoupon } from './issued-coupon.entity';

type CouponType = 'percent' | 'fixed';

@Entity()
export class Coupon extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  type: CouponType;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  value: number; // 할인율 또는 정액 금액

  @OneToMany(() => IssuedCoupon, (issuedCoupon) => issuedCoupon.coupon)
  issuedCoupons: Relation<IssuedCoupon[]>;
}
