import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, finalize, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICartItem } from '../cart-item.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, CartItemService } from '../service/cart-item.service';
import { CartItemDeleteDialogComponent } from '../delete/cart-item-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import { OrderService } from 'app/entities/order/service/order.service';
import { OrderDataService } from 'app/entities/order-data/service/order-data.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-cart-item',
  templateUrl: './cart-item.component.html',
})
export class CartItemComponent implements OnInit {
  cartItems!: ICartItem[];
  isLoading = false;
  checkOut: boolean = false;
  predicate = 'id';
  ascending = true;
  isSaving!: boolean;

  constructor(
    protected cartItemService: CartItemService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    protected orderDataSevice: OrderDataService
  ) {}

  trackId = (_index: number, item: ICartItem): number => this.cartItemService.getCartItemIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  delete(cartItem: ICartItem): void {
    const modalRef = this.modalService.open(CartItemDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.cartItem = cartItem;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.cartItems = this.refineData(dataFromBody);
  }

  protected refineData(data: ICartItem[]): ICartItem[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: ICartItem[] | null): ICartItem[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.cartItemService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }

  populate() {
    this.isSaving = true;
    this.subscribeToSaveResponse(this.orderDataSevice.populate(this.cartItems));
    this.router.navigate(['/cart-data']);
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<String>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      error: () => this.onSaveError(),
    });
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
