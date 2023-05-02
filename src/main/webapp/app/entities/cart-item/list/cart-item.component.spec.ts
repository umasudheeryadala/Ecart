import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CartItemService } from '../service/cart-item.service';

import { CartItemComponent } from './cart-item.component';

describe('CartItem Management Component', () => {
  let comp: CartItemComponent;
  let fixture: ComponentFixture<CartItemComponent>;
  let service: CartItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'cart-item', component: CartItemComponent }]), HttpClientTestingModule],
      declarations: [CartItemComponent],
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
      .overrideTemplate(CartItemComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CartItemComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CartItemService);

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
    expect(comp.cartItems?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to cartItemService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCartItemIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCartItemIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
