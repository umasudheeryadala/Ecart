import { IOrderItem, NewOrderItem } from './order-item.model';

export const sampleWithRequiredData: IOrderItem = {
  id: 62496,
  productName: 'Wipent Op Paddukb Guzbeao Tkhfyk',
  quantity: 41280,
  price: 89536,
};

export const sampleWithPartialData: IOrderItem = {
  id: 85674,
  productName: 'Vkxkivi Nfhg Iefkbeo Ifdy Pf Ca',
  quantity: 41734,
  price: 89527,
};

export const sampleWithFullData: IOrderItem = {
  id: 40923,
  productName: 'Gnbiqij Oplglbi Na',
  quantity: 47741,
  price: 95948,
};

export const sampleWithNewData: NewOrderItem = {
  productName: 'Ukr Hb',
  quantity: 65965,
  price: 16907,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
