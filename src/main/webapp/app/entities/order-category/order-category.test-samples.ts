import { IOrderCategory, NewOrderCategory } from './order-category.model';

export const sampleWithRequiredData: IOrderCategory = {
  id: 6616,
  categoryName: 'Jxywlx Cmuecav',
};

export const sampleWithPartialData: IOrderCategory = {
  id: 95443,
  categoryName: 'Tslhmw Meihz Umh Xtxq Nxovui Xwpvp',
  categoryImage: '../fake-data/blob/hipster.png',
  categoryImageContentType: 'unknown',
};

export const sampleWithFullData: IOrderCategory = {
  id: 94336,
  categoryName: 'Ykrpq Btpqteh',
  categoryImage: '../fake-data/blob/hipster.png',
  categoryImageContentType: 'unknown',
};

export const sampleWithNewData: NewOrderCategory = {
  categoryName: 'Eqr Du Pfw Ywycc Ebbwg Czcbwfb',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
