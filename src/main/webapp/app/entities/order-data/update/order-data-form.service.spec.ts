import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../order-data.test-samples';

import { OrderDataFormService } from './order-data-form.service';

describe('OrderData Form Service', () => {
  let service: OrderDataFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderDataFormService);
  });

  describe('Service methods', () => {
    describe('createOrderDataFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOrderDataFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quantity: expect.any(Object),
            productName: expect.any(Object),
            price: expect.any(Object),
            order: expect.any(Object),
          })
        );
      });

      it('passing IOrderData should create a new form with FormGroup', () => {
        const formGroup = service.createOrderDataFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quantity: expect.any(Object),
            productName: expect.any(Object),
            price: expect.any(Object),
            order: expect.any(Object),
          })
        );
      });
    });

    describe('getOrderData', () => {
      it('should return NewOrderData for default OrderData initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createOrderDataFormGroup(sampleWithNewData);

        const orderData = service.getOrderData(formGroup) as any;

        expect(orderData).toMatchObject(sampleWithNewData);
      });

      it('should return NewOrderData for empty OrderData initial value', () => {
        const formGroup = service.createOrderDataFormGroup();

        const orderData = service.getOrderData(formGroup) as any;

        expect(orderData).toMatchObject({});
      });

      it('should return IOrderData', () => {
        const formGroup = service.createOrderDataFormGroup(sampleWithRequiredData);

        const orderData = service.getOrderData(formGroup) as any;

        expect(orderData).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOrderData should not enable id FormControl', () => {
        const formGroup = service.createOrderDataFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOrderData should disable id FormControl', () => {
        const formGroup = service.createOrderDataFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
