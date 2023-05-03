import { Component, Input, OnInit } from '@angular/core';
import { IOrderData } from '../order-data.model';
import { EntityArrayResponseType, OrderDataService } from '../service/order-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ASC, DESC } from 'app/config/navigation.constants';
import { SortService } from 'app/shared/sort/sort.service';

@Component({
  selector: 'jhi-view-order-data',
  templateUrl: './view-order-data.component.html',
})
export class ViewOrderDataComponent implements OnInit {
  predicate = 'id';
  ascending = true;
  orderData?: IOrderData[];
  @Input() orderId!: number;
  isLoading = false;

  constructor(
    protected orderDataService: OrderDataService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return this.orderDataService.findByOrderId(this.orderId);
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.orderData = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: IOrderData[] | null): IOrderData[] {
    return data ?? [];
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
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
}
