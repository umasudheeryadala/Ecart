import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OrderCategoryComponent } from './list/order-category.component';
import { OrderCategoryDetailComponent } from './detail/order-category-detail.component';
import { OrderCategoryUpdateComponent } from './update/order-category-update.component';
import { OrderCategoryDeleteDialogComponent } from './delete/order-category-delete-dialog.component';
import { OrderCategoryRoutingModule } from './route/order-category-routing.module';

@NgModule({
  imports: [SharedModule, OrderCategoryRoutingModule],
  declarations: [OrderCategoryComponent, OrderCategoryDetailComponent, OrderCategoryUpdateComponent, OrderCategoryDeleteDialogComponent],
})
export class OrderCategoryModule {}
