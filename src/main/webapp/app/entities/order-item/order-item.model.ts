export interface IOrderItem {
  id: number;
  productName?: string | null;
  quantity?: number | null;
  price?: number | null;
}

export type NewOrderItem = Omit<IOrderItem, 'id'> & { id: null };
