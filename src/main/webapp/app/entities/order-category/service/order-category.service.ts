import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrderCategory, NewOrderCategory } from '../order-category.model';

export type PartialUpdateOrderCategory = Partial<IOrderCategory> & Pick<IOrderCategory, 'id'>;

export type EntityResponseType = HttpResponse<IOrderCategory>;
export type EntityArrayResponseType = HttpResponse<IOrderCategory[]>;

@Injectable({ providedIn: 'root' })
export class OrderCategoryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/order-categories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(orderCategory: NewOrderCategory): Observable<EntityResponseType> {
    return this.http.post<IOrderCategory>(this.resourceUrl, orderCategory, { observe: 'response' });
  }

  update(orderCategory: IOrderCategory): Observable<EntityResponseType> {
    return this.http.put<IOrderCategory>(`${this.resourceUrl}/${this.getOrderCategoryIdentifier(orderCategory)}`, orderCategory, {
      observe: 'response',
    });
  }

  partialUpdate(orderCategory: PartialUpdateOrderCategory): Observable<EntityResponseType> {
    return this.http.patch<IOrderCategory>(`${this.resourceUrl}/${this.getOrderCategoryIdentifier(orderCategory)}`, orderCategory, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOrderCategory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOrderCategory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOrderCategoryIdentifier(orderCategory: Pick<IOrderCategory, 'id'>): number {
    return orderCategory.id;
  }

  compareOrderCategory(o1: Pick<IOrderCategory, 'id'> | null, o2: Pick<IOrderCategory, 'id'> | null): boolean {
    return o1 && o2 ? this.getOrderCategoryIdentifier(o1) === this.getOrderCategoryIdentifier(o2) : o1 === o2;
  }

  addOrderCategoryToCollectionIfMissing<Type extends Pick<IOrderCategory, 'id'>>(
    orderCategoryCollection: Type[],
    ...orderCategoriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const orderCategories: Type[] = orderCategoriesToCheck.filter(isPresent);
    if (orderCategories.length > 0) {
      const orderCategoryCollectionIdentifiers = orderCategoryCollection.map(
        orderCategoryItem => this.getOrderCategoryIdentifier(orderCategoryItem)!
      );
      const orderCategoriesToAdd = orderCategories.filter(orderCategoryItem => {
        const orderCategoryIdentifier = this.getOrderCategoryIdentifier(orderCategoryItem);
        if (orderCategoryCollectionIdentifiers.includes(orderCategoryIdentifier)) {
          return false;
        }
        orderCategoryCollectionIdentifiers.push(orderCategoryIdentifier);
        return true;
      });
      return [...orderCategoriesToAdd, ...orderCategoryCollection];
    }
    return orderCategoryCollection;
  }
}
