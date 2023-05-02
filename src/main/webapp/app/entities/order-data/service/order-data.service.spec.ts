import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOrderData } from '../order-data.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../order-data.test-samples';

import { OrderDataService } from './order-data.service';

const requireRestSample: IOrderData = {
  ...sampleWithRequiredData,
};

describe('OrderData Service', () => {
  let service: OrderDataService;
  let httpMock: HttpTestingController;
  let expectedResult: IOrderData | IOrderData[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OrderDataService);
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

    it('should create a OrderData', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const orderData = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(orderData).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OrderData', () => {
      const orderData = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(orderData).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a OrderData', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of OrderData', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a OrderData', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOrderDataToCollectionIfMissing', () => {
      it('should add a OrderData to an empty array', () => {
        const orderData: IOrderData = sampleWithRequiredData;
        expectedResult = service.addOrderDataToCollectionIfMissing([], orderData);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(orderData);
      });

      it('should not add a OrderData to an array that contains it', () => {
        const orderData: IOrderData = sampleWithRequiredData;
        const orderDataCollection: IOrderData[] = [
          {
            ...orderData,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOrderDataToCollectionIfMissing(orderDataCollection, orderData);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OrderData to an array that doesn't contain it", () => {
        const orderData: IOrderData = sampleWithRequiredData;
        const orderDataCollection: IOrderData[] = [sampleWithPartialData];
        expectedResult = service.addOrderDataToCollectionIfMissing(orderDataCollection, orderData);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(orderData);
      });

      it('should add only unique OrderData to an array', () => {
        const orderDataArray: IOrderData[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const orderDataCollection: IOrderData[] = [sampleWithRequiredData];
        expectedResult = service.addOrderDataToCollectionIfMissing(orderDataCollection, ...orderDataArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const orderData: IOrderData = sampleWithRequiredData;
        const orderData2: IOrderData = sampleWithPartialData;
        expectedResult = service.addOrderDataToCollectionIfMissing([], orderData, orderData2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(orderData);
        expect(expectedResult).toContain(orderData2);
      });

      it('should accept null and undefined values', () => {
        const orderData: IOrderData = sampleWithRequiredData;
        expectedResult = service.addOrderDataToCollectionIfMissing([], null, orderData, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(orderData);
      });

      it('should return initial array if no OrderData is added', () => {
        const orderDataCollection: IOrderData[] = [sampleWithRequiredData];
        expectedResult = service.addOrderDataToCollectionIfMissing(orderDataCollection, undefined, null);
        expect(expectedResult).toEqual(orderDataCollection);
      });
    });

    describe('compareOrderData', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOrderData(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareOrderData(entity1, entity2);
        const compareResult2 = service.compareOrderData(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareOrderData(entity1, entity2);
        const compareResult2 = service.compareOrderData(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareOrderData(entity1, entity2);
        const compareResult2 = service.compareOrderData(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
