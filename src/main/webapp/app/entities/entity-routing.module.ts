import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'order',
        data: { pageTitle: 'Orders' },
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
      },
      {
        path: 'order-item',
        data: { pageTitle: 'OrderItems' },
        loadChildren: () => import('./order-item/order-item.module').then(m => m.OrderItemModule),
      },
      {
        path: 'order-data',
        data: { pageTitle: 'OrderData' },
        loadChildren: () => import('./order-data/order-data.module').then(m => m.OrderDataModule),
      },
      {
        path: 'cart-item',
        data: { pageTitle: 'CartItems' },
        loadChildren: () => import('./cart-item/cart-item.module').then(m => m.CartItemModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
