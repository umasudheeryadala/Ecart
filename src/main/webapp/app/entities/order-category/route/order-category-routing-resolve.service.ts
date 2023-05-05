import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrderCategory } from '../order-category.model';
import { OrderCategoryService } from '../service/order-category.service';

@Injectable({ providedIn: 'root' })
export class OrderCategoryRoutingResolveService implements Resolve<IOrderCategory | null> {
  constructor(protected service: OrderCategoryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrderCategory | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((orderCategory: HttpResponse<IOrderCategory>) => {
          if (orderCategory.body) {
            return of(orderCategory.body);
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
