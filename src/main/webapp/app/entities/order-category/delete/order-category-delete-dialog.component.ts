import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrderCategory } from '../order-category.model';
import { OrderCategoryService } from '../service/order-category.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './order-category-delete-dialog.component.html',
})
export class OrderCategoryDeleteDialogComponent {
  orderCategory?: IOrderCategory;

  constructor(protected orderCategoryService: OrderCategoryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.orderCategoryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
