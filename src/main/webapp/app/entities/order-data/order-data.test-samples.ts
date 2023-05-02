import { IOrderData, NewOrderData } from './order-data.model';

export const sampleWithRequiredData: IOrderData = {
  id: 40374,
  quantity: 12430,
  productName: 'Ukqtqgx Sqs Vjzsax Qsvvsax Wmcvb Hunhvno',
  price: 94432,
};

export const sampleWithPartialData: IOrderData = {
  id: 90027,
  quantity: 93044,
  productName: 'Xowd Evtw Ui',
  price: 347,
};

export const sampleWithFullData: IOrderData = {
  id: 52725,
  quantity: 61108,
  productName: 'Arvkjff Gbdltj Sgokym',
  price: 14455,
};

export const sampleWithNewData: NewOrderData = {
  quantity: 74020,
  productName: 'Supqa Qanbzrq Hnt Kitkvjv We',
  price: 88787,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
