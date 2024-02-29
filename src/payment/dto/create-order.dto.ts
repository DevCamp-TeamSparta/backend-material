import { OrderItem } from '../entities';

export type CreateOrderDto = {
  userId: string;
  orderItems: OrderItem[];
  couponId?: string;
  pointAmountToUse?: number;
  shippingAddress?: string;
};
