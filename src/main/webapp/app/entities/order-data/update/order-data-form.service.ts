import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IOrderData, NewOrderData } from '../order-data.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOrderData for edit and NewOrderDataFormGroupInput for create.
 */
type OrderDataFormGroupInput = IOrderData | PartialWithRequiredKeyOf<NewOrderData>;

type OrderDataFormDefaults = Pick<NewOrderData, 'id'>;

type OrderDataFormGroupContent = {
  id: FormControl<IOrderData['id'] | NewOrderData['id']>;
  quantity: FormControl<IOrderData['quantity']>;
  productName: FormControl<IOrderData['productName']>;
  price: FormControl<IOrderData['price']>;
  order: FormControl<IOrderData['order']>;
};

export type OrderDataFormGroup = FormGroup<OrderDataFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OrderDataFormService {
  createOrderDataFormGroup(orderData: OrderDataFormGroupInput = { id: null }): OrderDataFormGroup {
    const orderDataRawValue = {
      ...this.getFormDefaults(),
      ...orderData,
    };
    return new FormGroup<OrderDataFormGroupContent>({
      id: new FormControl(
        { value: orderDataRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      quantity: new FormControl(orderDataRawValue.quantity, {
        validators: [Validators.required],
      }),
      productName: new FormControl(orderDataRawValue.productName, {
        validators: [Validators.required, Validators.pattern('([A-Z][a-z]+)( [A-Z][a-z]+)*')],
      }),
      price: new FormControl(orderDataRawValue.price, {
        validators: [Validators.required],
      }),
      order: new FormControl(orderDataRawValue.order),
    });
  }

  getOrderData(form: OrderDataFormGroup): IOrderData | NewOrderData {
    return form.getRawValue() as IOrderData | NewOrderData;
  }

  resetForm(form: OrderDataFormGroup, orderData: OrderDataFormGroupInput): void {
    const orderDataRawValue = { ...this.getFormDefaults(), ...orderData };
    form.reset(
      {
        ...orderDataRawValue,
        id: { value: orderDataRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): OrderDataFormDefaults {
    return {
      id: null,
    };
  }
}
