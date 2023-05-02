import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrderData } from '../order-data.model';
import { OrderDataService } from '../service/order-data.service';

@Injectable({ providedIn: 'root' })
export class OrderDataRoutingResolveService implements Resolve<IOrderData | null> {
  constructor(protected service: OrderDataService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrderData | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((orderData: HttpResponse<IOrderData>) => {
          if (orderData.body) {
            return of(orderData.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
