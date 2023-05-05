import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OrderCategoryComponent } from '../list/order-category.component';
import { OrderCategoryDetailComponent } from '../detail/order-category-detail.component';
import { OrderCategoryUpdateComponent } from '../update/order-category-update.component';
import { OrderCategoryRoutingResolveService } from './order-category-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const orderCategoryRoute: Routes = [
  {
    path: '',
    component: OrderCategoryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrderCategoryDetailComponent,
    resolve: {
      orderCategory: OrderCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrderCategoryUpdateComponent,
    resolve: {
      orderCategory: OrderCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrderCategoryUpdateComponent,
    resolve: {
      orderCategory: OrderCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(orderCategoryRoute)],
  exports: [RouterModule],
})
export class OrderCategoryRoutingModule {}
