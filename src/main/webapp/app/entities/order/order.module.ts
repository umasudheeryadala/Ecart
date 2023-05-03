import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OrderComponent } from './list/order.component';
import { OrderDetailComponent } from './detail/order-detail.component';
import { OrderUpdateComponent } from './update/order-update.component';
import { OrderDeleteDialogComponent } from './delete/order-delete-dialog.component';
import { OrderRoutingModule } from './route/order-routing.module';
import { OrderDataComponent } from '../order-data/list/order-data.component';
import { OrderDataModule } from '../order-data/order-data.module';

@NgModule({
  imports: [SharedModule, OrderRoutingModule, OrderDataModule],
  declarations: [OrderComponent, OrderDetailComponent, OrderUpdateComponent, OrderDeleteDialogComponent],
})
export class OrderModule {}
