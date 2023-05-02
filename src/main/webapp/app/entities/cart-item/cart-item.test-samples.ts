import { ICartItem, NewCartItem } from './cart-item.model';

export const sampleWithRequiredData: ICartItem = {
  id: 44067,
};

export const sampleWithPartialData: ICartItem = {
  id: 26751,
  price: 78154,
};

export const sampleWithFullData: ICartItem = {
  id: 2041,
  orderItemId: 47026,
  productName: 'Future-proofed Illinois',
  price: 77995,
  quantity: 60268,
};

export const sampleWithNewData: NewCartItem = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
