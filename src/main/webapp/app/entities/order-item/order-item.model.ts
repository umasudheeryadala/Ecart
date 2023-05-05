import { IOrderCategory } from 'app/entities/order-category/order-category.model';

export interface IOrderItem {
  id: number;
  productName?: string | null;
  quantity?: number | null;
  price?: number | null;
  orderCategory?: Pick<IOrderCategory, 'id'> | null;
}

export type NewOrderItem = Omit<IOrderItem, 'id'> & { id: null };
