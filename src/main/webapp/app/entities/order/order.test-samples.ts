import dayjs from 'dayjs/esm';

import { IOrder, NewOrder } from './order.model';

export const sampleWithRequiredData: IOrder = {
  id: 47761,
  orderDate: dayjs('2023-04-30'),
};

export const sampleWithPartialData: IOrder = {
  id: 70907,
  orderDate: dayjs('2023-04-30'),
};

export const sampleWithFullData: IOrder = {
  id: 69128,
  orderDate: dayjs('2023-04-30'),
};

export const sampleWithNewData: NewOrder = {
  orderDate: dayjs('2023-04-30'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
