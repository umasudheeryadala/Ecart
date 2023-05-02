import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CartItemComponent } from './list/cart-item.component';
import { CartItemDetailComponent } from './detail/cart-item-detail.component';
import { CartItemUpdateComponent } from './update/cart-item-update.component';
import { CartItemDeleteDialogComponent } from './delete/cart-item-delete-dialog.component';
import { CartItemRoutingModule } from './route/cart-item-routing.module';
import { AdditemComponent } from './additem/additem.component';
import { CartItemRoutingResolveService } from './route/cart-item-routing-resolve.service';

@NgModule({
  imports: [SharedModule, CartItemRoutingModule],
  declarations: [CartItemComponent, CartItemDetailComponent, CartItemUpdateComponent, CartItemDeleteDialogComponent, AdditemComponent],
  exports: [AdditemComponent],
  providers: [CartItemRoutingResolveService],
})
export class CartItemModule {}
