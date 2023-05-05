import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OrderCategoryFormService } from './order-category-form.service';
import { OrderCategoryService } from '../service/order-category.service';
import { IOrderCategory } from '../order-category.model';

import { OrderCategoryUpdateComponent } from './order-category-update.component';

describe('OrderCategory Management Update Component', () => {
  let comp: OrderCategoryUpdateComponent;
  let fixture: ComponentFixture<OrderCategoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let orderCategoryFormService: OrderCategoryFormService;
  let orderCategoryService: OrderCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OrderCategoryUpdateComponent],
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
      .overrideTemplate(OrderCategoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrderCategoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    orderCategoryFormService = TestBed.inject(OrderCategoryFormService);
    orderCategoryService = TestBed.inject(OrderCategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const orderCategory: IOrderCategory = { id: 456 };

      activatedRoute.data = of({ orderCategory });
      comp.ngOnInit();

      expect(comp.orderCategory).toEqual(orderCategory);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrderCategory>>();
      const orderCategory = { id: 123 };
      jest.spyOn(orderCategoryFormService, 'getOrderCategory').mockReturnValue(orderCategory);
      jest.spyOn(orderCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: orderCategory }));
      saveSubject.complete();

      // THEN
      expect(orderCategoryFormService.getOrderCategory).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(orderCategoryService.update).toHaveBeenCalledWith(expect.objectContaining(orderCategory));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrderCategory>>();
      const orderCategory = { id: 123 };
      jest.spyOn(orderCategoryFormService, 'getOrderCategory').mockReturnValue({ id: null });
      jest.spyOn(orderCategoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderCategory: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: orderCategory }));
      saveSubject.complete();

      // THEN
      expect(orderCategoryFormService.getOrderCategory).toHaveBeenCalled();
      expect(orderCategoryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrderCategory>>();
      const orderCategory = { id: 123 };
      jest.spyOn(orderCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(orderCategoryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
