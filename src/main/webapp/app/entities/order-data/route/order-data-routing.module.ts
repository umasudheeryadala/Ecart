import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OrderDataComponent } from '../list/order-data.component';
import { OrderDataDetailComponent } from '../detail/order-data-detail.component';
import { OrderDataUpdateComponent } from '../update/order-data-update.component';
import { OrderDataRoutingResolveService } from './order-data-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const orderDataRoute: Routes = [
  {
    path: '',
    component: OrderDataComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrderDataDetailComponent,
    resolve: {
      orderData: OrderDataRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrderDataUpdateComponent,
    resolve: {
      orderData: OrderDataRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrderDataUpdateComponent,
    resolve: {
      orderData: OrderDataRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(orderDataRoute)],
  exports: [RouterModule],
})
export class OrderDataRoutingModule {}
