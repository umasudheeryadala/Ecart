import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IOrderCategory, NewOrderCategory } from '../order-category.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOrderCategory for edit and NewOrderCategoryFormGroupInput for create.
 */
type OrderCategoryFormGroupInput = IOrderCategory | PartialWithRequiredKeyOf<NewOrderCategory>;

type OrderCategoryFormDefaults = Pick<NewOrderCategory, 'id'>;

type OrderCategoryFormGroupContent = {
  id: FormControl<IOrderCategory['id'] | NewOrderCategory['id']>;
  categoryName: FormControl<IOrderCategory['categoryName']>;
  categoryImage: FormControl<IOrderCategory['categoryImage']>;
  categoryImageContentType: FormControl<IOrderCategory['categoryImageContentType']>;
};

export type OrderCategoryFormGroup = FormGroup<OrderCategoryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OrderCategoryFormService {
  createOrderCategoryFormGroup(orderCategory: OrderCategoryFormGroupInput = { id: null }): OrderCategoryFormGroup {
    const orderCategoryRawValue = {
      ...this.getFormDefaults(),
      ...orderCategory,
    };
    return new FormGroup<OrderCategoryFormGroupContent>({
      id: new FormControl(
        { value: orderCategoryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      categoryName: new FormControl(orderCategoryRawValue.categoryName, {
        validators: [Validators.required, Validators.pattern('([A-Z][a-z]+)( [A-Z][a-z]+)*')],
      }),
      categoryImage: new FormControl(orderCategoryRawValue.categoryImage),
      categoryImageContentType: new FormControl(orderCategoryRawValue.categoryImageContentType),
    });
  }

  getOrderCategory(form: OrderCategoryFormGroup): IOrderCategory | NewOrderCategory {
    return form.getRawValue() as IOrderCategory | NewOrderCategory;
  }

  resetForm(form: OrderCategoryFormGroup, orderCategory: OrderCategoryFormGroupInput): void {
    const orderCategoryRawValue = { ...this.getFormDefaults(), ...orderCategory };
    form.reset(
      {
        ...orderCategoryRawValue,
        id: { value: orderCategoryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): OrderCategoryFormDefaults {
    return {
      id: null,
    };
  }
}
