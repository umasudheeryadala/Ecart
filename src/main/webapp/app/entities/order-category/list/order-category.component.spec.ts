import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { OrderCategoryService } from '../service/order-category.service';

import { OrderCategoryComponent } from './order-category.component';

describe('OrderCategory Management Component', () => {
  let comp: OrderCategoryComponent;
  let fixture: ComponentFixture<OrderCategoryComponent>;
  let service: OrderCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'order-category', component: OrderCategoryComponent }]), HttpClientTestingModule],
      declarations: [OrderCategoryComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(OrderCategoryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrderCategoryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OrderCategoryService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.orderCategories?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to orderCategoryService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getOrderCategoryIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getOrderCategoryIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
