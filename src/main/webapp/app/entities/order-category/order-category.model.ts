export interface IOrderCategory {
  id: number;
  categoryName?: string | null;
  categoryImage?: string | null;
  categoryImageContentType?: string | null;
}

export type NewOrderCategory = Omit<IOrderCategory, 'id'> & { id: null };
