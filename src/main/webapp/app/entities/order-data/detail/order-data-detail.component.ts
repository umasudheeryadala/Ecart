import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrderData } from '../order-data.model';

@Component({
  selector: 'jhi-order-data-detail',
  templateUrl: './order-data-detail.component.html',
})
export class OrderDataDetailComponent implements OnInit {
  orderData: IOrderData | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderData }) => {
      this.orderData = orderData;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
