import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OrderItemComponent } from './list/order-item.component';
import { OrderItemDetailComponent } from './detail/order-item-detail.component';
import { OrderItemUpdateComponent } from './update/order-item-update.component';
import { OrderItemDeleteDialogComponent } from './delete/order-item-delete-dialog.component';
import { OrderItemRoutingModule } from './route/order-item-routing.module';
import { CartItemModule } from '../cart-item/cart-item.module';

@NgModule({
  imports: [SharedModule, OrderItemRoutingModule, CartItemModule],
  declarations: [OrderItemComponent, OrderItemDetailComponent, OrderItemUpdateComponent, OrderItemDeleteDialogComponent],
})
export class OrderItemModule {}
