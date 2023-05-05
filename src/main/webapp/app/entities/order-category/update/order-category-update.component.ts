import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { OrderCategoryFormService, OrderCategoryFormGroup } from './order-category-form.service';
import { IOrderCategory } from '../order-category.model';
import { OrderCategoryService } from '../service/order-category.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-order-category-update',
  templateUrl: './order-category-update.component.html',
})
export class OrderCategoryUpdateComponent implements OnInit {
  isSaving = false;
  orderCategory: IOrderCategory | null = null;

  editForm: OrderCategoryFormGroup = this.orderCategoryFormService.createOrderCategoryFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected orderCategoryService: OrderCategoryService,
    protected orderCategoryFormService: OrderCategoryFormService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderCategory }) => {
      this.orderCategory = orderCategory;
      if (orderCategory) {
        this.updateForm(orderCategory);
      }
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('ecartApp.error', { message: err.message })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const orderCategory = this.orderCategoryFormService.getOrderCategory(this.editForm);
    if (orderCategory.id !== null) {
      this.subscribeToSaveResponse(this.orderCategoryService.update(orderCategory));
    } else {
      this.subscribeToSaveResponse(this.orderCategoryService.create(orderCategory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderCategory>>): void {
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

  protected updateForm(orderCategory: IOrderCategory): void {
    this.orderCategory = orderCategory;
    this.orderCategoryFormService.resetForm(this.editForm, orderCategory);
  }
}
