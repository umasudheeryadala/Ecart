import { IOrder } from 'app/entities/order/order.model';

export interface IOrderData {
  id: number;
  quantity?: number | null;
  productName?: string | null;
  price?: number | null;
  order?: Pick<IOrder, 'id'> | null;
}

export type NewOrderData = Omit<IOrderData, 'id'> & { id: null };
