import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OrderDataComponent } from './list/order-data.component';
import { OrderDataDetailComponent } from './detail/order-data-detail.component';
import { OrderDataUpdateComponent } from './update/order-data-update.component';
import { OrderDataDeleteDialogComponent } from './delete/order-data-delete-dialog.component';
import { OrderDataRoutingModule } from './route/order-data-routing.module';
import { OrderComponent } from '../order/list/order.component';
import { OrderModule } from '../order/order.module';
import { ViewOrderDataComponent } from './view-order-data/view-order-data.component';

@NgModule({
  imports: [SharedModule, OrderDataRoutingModule],
  declarations: [
    OrderDataComponent,
    OrderDataDetailComponent,
    OrderDataUpdateComponent,
    OrderDataDeleteDialogComponent,
    ViewOrderDataComponent,
  ],
  exports: [ViewOrderDataComponent],
})
export class OrderDataModule {}
