import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CartItemDetailComponent } from './cart-item-detail.component';

describe('CartItem Management Detail Component', () => {
  let comp: CartItemDetailComponent;
  let fixture: ComponentFixture<CartItemDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CartItemDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ cartItem: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CartItemDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CartItemDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load cartItem on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.cartItem).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
