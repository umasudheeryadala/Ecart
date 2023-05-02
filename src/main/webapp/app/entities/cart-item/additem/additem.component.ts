import { ICartItem } from './../cart-item.model';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderItemService } from 'app/entities/order-item/service/order-item.service';
import { CartItemService } from '../service/cart-item.service';
import { Observable, finalize } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-additem',
  templateUrl: './additem.component.html',
})
export class AdditemComponent implements OnInit {
  @Input() availableQuantity: any | null;
  @Input() orderItemId: any | null;
  @Input() productName: any | null;
  @Input() price!: any | null;
  cartItem!: ICartItem;
  link: any;
  quantity: number;
  isSaving!: boolean;
  constructor(
    protected orderItemService: OrderItemService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected modalService: NgbModal,
    protected cartItemService: CartItemService
  ) {
    this.quantity = 0;
  }

  ngOnInit(): void {}
  incrementQty() {
    if (this.quantity >= 0 && this.availableQuantity >= this.quantity) {
      this.quantity = this.quantity + 1;
    } else {
      this.quantity = this.quantity;
    }
  }
  decrementQty() {
    if (this.quantity > 0) {
      this.quantity = this.quantity - 1;
    } else {
      this.quantity = 0;
    }
  }
  submit() {
    if (this.quantity > 0) {
      this.cartItem = {
        id: 0,
        orderItemId: this.orderItemId,
        productName: this.productName,
        price: this.price * this.quantity,
        quantity: this.quantity,
      };
      console.log(this.cartItem);
      this.isSaving = true;
      this.subscribeToSaveResponse(this.cartItemService.insert(this.cartItem));
      this.quantity = 0;
    }
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICartItem>>): void {
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
