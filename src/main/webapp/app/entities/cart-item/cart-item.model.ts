import { IUser } from 'app/entities/user/user.model';

export interface ICartItem {
  id: number;
  orderItemId?: number | null;
  productName?: string | null;
  price?: number | null;
  quantity?: number | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewCartItem = Omit<ICartItem, 'id'> & { id: null };
