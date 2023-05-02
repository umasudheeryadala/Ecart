import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrderDataDetailComponent } from './order-data-detail.component';

describe('OrderData Management Detail Component', () => {
  let comp: OrderDataDetailComponent;
  let fixture: ComponentFixture<OrderDataDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderDataDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ orderData: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OrderDataDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OrderDataDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load orderData on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.orderData).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
