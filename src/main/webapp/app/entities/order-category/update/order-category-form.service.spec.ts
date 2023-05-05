import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../order-category.test-samples';

import { OrderCategoryFormService } from './order-category-form.service';

describe('OrderCategory Form Service', () => {
  let service: OrderCategoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderCategoryFormService);
  });

  describe('Service methods', () => {
    describe('createOrderCategoryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOrderCategoryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            categoryName: expect.any(Object),
            categoryImage: expect.any(Object),
          })
        );
      });

      it('passing IOrderCategory should create a new form with FormGroup', () => {
        const formGroup = service.createOrderCategoryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            categoryName: expect.any(Object),
            categoryImage: expect.any(Object),
          })
        );
      });
    });

    describe('getOrderCategory', () => {
      it('should return NewOrderCategory for default OrderCategory initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createOrderCategoryFormGroup(sampleWithNewData);

        const orderCategory = service.getOrderCategory(formGroup) as any;

        expect(orderCategory).toMatchObject(sampleWithNewData);
      });

      it('should return NewOrderCategory for empty OrderCategory initial value', () => {
        const formGroup = service.createOrderCategoryFormGroup();

        const orderCategory = service.getOrderCategory(formGroup) as any;

        expect(orderCategory).toMatchObject({});
      });

      it('should return IOrderCategory', () => {
        const formGroup = service.createOrderCategoryFormGroup(sampleWithRequiredData);

        const orderCategory = service.getOrderCategory(formGroup) as any;

        expect(orderCategory).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOrderCategory should not enable id FormControl', () => {
        const formGroup = service.createOrderCategoryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOrderCategory should disable id FormControl', () => {
        const formGroup = service.createOrderCategoryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
