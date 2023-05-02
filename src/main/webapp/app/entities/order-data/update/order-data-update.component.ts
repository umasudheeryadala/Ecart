import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { OrderDataFormService, OrderDataFormGroup } from './order-data-form.service';
import { IOrderData } from '../order-data.model';
import { OrderDataService } from '../service/order-data.service';
import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';

@Component({
  selector: 'jhi-order-data-update',
  templateUrl: './order-data-update.component.html',
})
export class OrderDataUpdateComponent implements OnInit {
  isSaving = false;
  orderData: IOrderData | null = null;

  ordersSharedCollection: IOrder[] = [];

  editForm: OrderDataFormGroup = this.orderDataFormService.createOrderDataFormGroup();

  constructor(
    protected orderDataService: OrderDataService,
    protected orderDataFormService: OrderDataFormService,
    protected orderService: OrderService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareOrder = (o1: IOrder | null, o2: IOrder | null): boolean => this.orderService.compareOrder(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderData }) => {
      this.orderData = orderData;
      if (orderData) {
        this.updateForm(orderData);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const orderData = this.orderDataFormService.getOrderData(this.editForm);
    if (orderData.id !== null) {
      this.subscribeToSaveResponse(this.orderDataService.update(orderData));
    } else {
      // this.subscribeToSaveResponse(this.orderDataService.create(orderData));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderData>>): void {
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

  protected updateForm(orderData: IOrderData): void {
    this.orderData = orderData;
    this.orderDataFormService.resetForm(this.editForm, orderData);

    this.ordersSharedCollection = this.orderService.addOrderToCollectionIfMissing<IOrder>(this.ordersSharedCollection, orderData.order);
  }

  protected loadRelationshipsOptions(): void {
    this.orderService
      .query()
      .pipe(map((res: HttpResponse<IOrder[]>) => res.body ?? []))
      .pipe(map((orders: IOrder[]) => this.orderService.addOrderToCollectionIfMissing<IOrder>(orders, this.orderData?.order)))
      .subscribe((orders: IOrder[]) => (this.ordersSharedCollection = orders));
  }
}
