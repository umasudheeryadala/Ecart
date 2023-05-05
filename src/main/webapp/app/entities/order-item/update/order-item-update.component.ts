import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { OrderItemFormService, OrderItemFormGroup } from './order-item-form.service';
import { IOrderItem } from '../order-item.model';
import { OrderItemService } from '../service/order-item.service';
import { IOrderCategory } from 'app/entities/order-category/order-category.model';
import { OrderCategoryService } from 'app/entities/order-category/service/order-category.service';

@Component({
  selector: 'jhi-order-item-update',
  templateUrl: './order-item-update.component.html',
})
export class OrderItemUpdateComponent implements OnInit {
  isSaving = false;
  orderItem: IOrderItem | null = null;

  orderCategoriesSharedCollection: IOrderCategory[] = [];

  editForm: OrderItemFormGroup = this.orderItemFormService.createOrderItemFormGroup();

  constructor(
    protected orderItemService: OrderItemService,
    protected orderItemFormService: OrderItemFormService,
    protected orderCategoryService: OrderCategoryService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareOrderCategory = (o1: IOrderCategory | null, o2: IOrderCategory | null): boolean =>
    this.orderCategoryService.compareOrderCategory(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderItem }) => {
      this.orderItem = orderItem;
      if (orderItem) {
        this.updateForm(orderItem);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const orderItem = this.orderItemFormService.getOrderItem(this.editForm);
    if (orderItem.id !== null) {
      this.subscribeToSaveResponse(this.orderItemService.update(orderItem));
    } else {
      this.subscribeToSaveResponse(this.orderItemService.create(orderItem));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderItem>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(orderItem: IOrderItem): void {
    this.orderItem = orderItem;
    this.orderItemFormService.resetForm(this.editForm, orderItem);

    this.orderCategoriesSharedCollection = this.orderCategoryService.addOrderCategoryToCollectionIfMissing<IOrderCategory>(
      this.orderCategoriesSharedCollection,
      orderItem.orderCategory
    );
  }

  protected loadRelationshipsOptions(): void {
    this.orderCategoryService
      .query()
      .pipe(map((res: HttpResponse<IOrderCategory[]>) => res.body ?? []))
      .pipe(
        map((orderCategories: IOrderCategory[]) =>
          this.orderCategoryService.addOrderCategoryToCollectionIfMissing<IOrderCategory>(orderCategories, this.orderItem?.orderCategory)
        )
      )
      .subscribe((orderCategories: IOrderCategory[]) => (this.orderCategoriesSharedCollection = orderCategories));
  }
}
