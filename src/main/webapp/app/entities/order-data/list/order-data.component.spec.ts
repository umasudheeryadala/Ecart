import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { OrderDataService } from '../service/order-data.service';

import { OrderDataComponent } from './order-data.component';

describe('OrderData Management Component', () => {
  let comp: OrderDataComponent;
  let fixture: ComponentFixture<OrderDataComponent>;
  let service: OrderDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'order-data', component: OrderDataComponent }]), HttpClientTestingModule],
      declarations: [OrderDataComponent],
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
      .overrideTemplate(OrderDataComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrderDataComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OrderDataService);

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
    expect(comp.orderData?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to orderDataService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getOrderDataIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getOrderDataIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
