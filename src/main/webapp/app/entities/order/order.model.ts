import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IOrder {
  id: number;
  orderDate?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewOrder = Omit<IOrder, 'id'> & { id: null };
