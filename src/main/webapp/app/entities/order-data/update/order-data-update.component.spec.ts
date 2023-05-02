import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OrderDataFormService } from './order-data-form.service';
import { OrderDataService } from '../service/order-data.service';
import { IOrderData } from '../order-data.model';
import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';

import { OrderDataUpdateComponent } from './order-data-update.component';

describe('OrderData Management Update Component', () => {
  let comp: OrderDataUpdateComponent;
  let fixture: ComponentFixture<OrderDataUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let orderDataFormService: OrderDataFormService;
  let orderDataService: OrderDataService;
  let orderService: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OrderDataUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(OrderDataUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrderDataUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    orderDataFormService = TestBed.inject(OrderDataFormService);
    orderDataService = TestBed.inject(OrderDataService);
    orderService = TestBed.inject(OrderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Order query and add missing value', () => {
      const orderData: IOrderData = { id: 456 };
      const order: IOrder = { id: 60685 };
      orderData.order = order;

      const orderCollection: IOrder[] = [{ id: 84915 }];
      jest.spyOn(orderService, 'query').mockReturnValue(of(new HttpResponse({ body: orderCollection })));
      const additionalOrders = [order];
      const expectedCollection: IOrder[] = [...additionalOrders, ...orderCollection];
      jest.spyOn(orderService, 'addOrderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ orderData });
      comp.ngOnInit();

      expect(orderService.query).toHaveBeenCalled();
      expect(orderService.addOrderToCollectionIfMissing).toHaveBeenCalledWith(
        orderCollection,
        ...additionalOrders.map(expect.objectContaining)
      );
      expect(comp.ordersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const orderData: IOrderData = { id: 456 };
      const order: IOrder = { id: 76080 };
      orderData.order = order;

      activatedRoute.data = of({ orderData });
      comp.ngOnInit();

      expect(comp.ordersSharedCollection).toContain(order);
      expect(comp.orderData).toEqual(orderData);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrderData>>();
      const orderData = { id: 123 };
      jest.spyOn(orderDataFormService, 'getOrderData').mockReturnValue(orderData);
      jest.spyOn(orderDataService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderData });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: orderData }));
      saveSubject.complete();

      // THEN
      expect(orderDataFormService.getOrderData).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(orderDataService.update).toHaveBeenCalledWith(expect.objectContaining(orderData));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrderData>>();
      const orderData = { id: 123 };
      jest.spyOn(orderDataFormService, 'getOrderData').mockReturnValue({ id: null });
      jest.spyOn(orderDataService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderData: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: orderData }));
      saveSubject.complete();

      // THEN
      expect(orderDataFormService.getOrderData).toHaveBeenCalled();
      expect(orderDataService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrderData>>();
      const orderData = { id: 123 };
      jest.spyOn(orderDataService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderData });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(orderDataService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareOrder', () => {
      it('Should forward to orderService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(orderService, 'compareOrder');
        comp.compareOrder(entity, entity2);
        expect(orderService.compareOrder).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
