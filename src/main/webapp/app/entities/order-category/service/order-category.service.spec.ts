import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOrderCategory } from '../order-category.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../order-category.test-samples';

import { OrderCategoryService } from './order-category.service';

const requireRestSample: IOrderCategory = {
  ...sampleWithRequiredData,
};

describe('OrderCategory Service', () => {
  let service: OrderCategoryService;
  let httpMock: HttpTestingController;
  let expectedResult: IOrderCategory | IOrderCategory[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OrderCategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a OrderCategory', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const orderCategory = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(orderCategory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OrderCategory', () => {
      const orderCategory = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(orderCategory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a OrderCategory', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of OrderCategory', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a OrderCategory', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOrderCategoryToCollectionIfMissing', () => {
      it('should add a OrderCategory to an empty array', () => {
        const orderCategory: IOrderCategory = sampleWithRequiredData;
        expectedResult = service.addOrderCategoryToCollectionIfMissing([], orderCategory);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(orderCategory);
      });

      it('should not add a OrderCategory to an array that contains it', () => {
        const orderCategory: IOrderCategory = sampleWithRequiredData;
        const orderCategoryCollection: IOrderCategory[] = [
          {
            ...orderCategory,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOrderCategoryToCollectionIfMissing(orderCategoryCollection, orderCategory);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OrderCategory to an array that doesn't contain it", () => {
        const orderCategory: IOrderCategory = sampleWithRequiredData;
        const orderCategoryCollection: IOrderCategory[] = [sampleWithPartialData];
        expectedResult = service.addOrderCategoryToCollectionIfMissing(orderCategoryCollection, orderCategory);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(orderCategory);
      });

      it('should add only unique OrderCategory to an array', () => {
        const orderCategoryArray: IOrderCategory[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const orderCategoryCollection: IOrderCategory[] = [sampleWithRequiredData];
        expectedResult = service.addOrderCategoryToCollectionIfMissing(orderCategoryCollection, ...orderCategoryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const orderCategory: IOrderCategory = sampleWithRequiredData;
        const orderCategory2: IOrderCategory = sampleWithPartialData;
        expectedResult = service.addOrderCategoryToCollectionIfMissing([], orderCategory, orderCategory2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(orderCategory);
        expect(expectedResult).toContain(orderCategory2);
      });

      it('should accept null and undefined values', () => {
        const orderCategory: IOrderCategory = sampleWithRequiredData;
        expectedResult = service.addOrderCategoryToCollectionIfMissing([], null, orderCategory, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(orderCategory);
      });

      it('should return initial array if no OrderCategory is added', () => {
        const orderCategoryCollection: IOrderCategory[] = [sampleWithRequiredData];
        expectedResult = service.addOrderCategoryToCollectionIfMissing(orderCategoryCollection, undefined, null);
        expect(expectedResult).toEqual(orderCategoryCollection);
      });
    });

    describe('compareOrderCategory', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOrderCategory(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareOrderCategory(entity1, entity2);
        const compareResult2 = service.compareOrderCategory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareOrderCategory(entity1, entity2);
        const compareResult2 = service.compareOrderCategory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareOrderCategory(entity1, entity2);
        const compareResult2 = service.compareOrderCategory(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
