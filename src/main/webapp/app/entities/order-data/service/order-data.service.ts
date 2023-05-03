import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrderData, NewOrderData } from '../order-data.model';
import { ICartItem } from 'app/entities/cart-item/cart-item.model';

export type PartialUpdateOrderData = Partial<IOrderData> & Pick<IOrderData, 'id'>;

export type EntityResponseType = HttpResponse<IOrderData>;
export type EntityStringResponseType = HttpResponse<String>;
export type EntityArrayResponseType = HttpResponse<IOrderData[]>;

@Injectable({ providedIn: 'root' })
export class OrderDataService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/order-data');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(cartItems: ICartItem[]): Observable<EntityStringResponseType> {
    return this.http.post<String>(this.resourceUrl, cartItems, { observe: 'response' });
  }

  // create(orderData: NewOrderData): Observable<EntityResponseType> {
  //   return this.http.post<IOrderData>(this.resourceUrl, orderData, { observe: 'response' });
  // }

  update(orderData: IOrderData): Observable<EntityResponseType> {
    return this.http.put<IOrderData>(`${this.resourceUrl}/${this.getOrderDataIdentifier(orderData)}`, orderData, { observe: 'response' });
  }

  partialUpdate(orderData: PartialUpdateOrderData): Observable<EntityResponseType> {
    return this.http.patch<IOrderData>(`${this.resourceUrl}/${this.getOrderDataIdentifier(orderData)}`, orderData, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOrderData>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByOrderId(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<IOrderData[]>(`${this.resourceUrl + '/user'}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOrderData[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOrderDataIdentifier(orderData: Pick<IOrderData, 'id'>): number {
    return orderData.id;
  }

  compareOrderData(o1: Pick<IOrderData, 'id'> | null, o2: Pick<IOrderData, 'id'> | null): boolean {
    return o1 && o2 ? this.getOrderDataIdentifier(o1) === this.getOrderDataIdentifier(o2) : o1 === o2;
  }

  addOrderDataToCollectionIfMissing<Type extends Pick<IOrderData, 'id'>>(
    orderDataCollection: Type[],
    ...orderDataToCheck: (Type | null | undefined)[]
  ): Type[] {
    const orderData: Type[] = orderDataToCheck.filter(isPresent);
    if (orderData.length > 0) {
      const orderDataCollectionIdentifiers = orderDataCollection.map(orderDataItem => this.getOrderDataIdentifier(orderDataItem)!);
      const orderDataToAdd = orderData.filter(orderDataItem => {
        const orderDataIdentifier = this.getOrderDataIdentifier(orderDataItem);
        if (orderDataCollectionIdentifiers.includes(orderDataIdentifier)) {
          return false;
        }
        orderDataCollectionIdentifiers.push(orderDataIdentifier);
        return true;
      });
      return [...orderDataToAdd, ...orderDataCollection];
    }
    return orderDataCollection;
  }
}
