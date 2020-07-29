import { tap } from 'rxjs/operators';
import { BlockingQueue } from '../src/index';

describe('BlockingQueue', () => {
  let blockingQueue: BlockingQueue<number>;
  let callSpy: jasmine.Spy;

  beforeEach(() => {
    callSpy = jasmine.createSpy('callSpy');
  });

  describe('constructing without params', () => {
    const testValue = 1;
    beforeEach(() => {
      blockingQueue = new BlockingQueue();
    });

    it('should create instance of BlockingQueue', () => {
      expect(blockingQueue).toBeTruthy();
      expect(blockingQueue.size).toBeDefined();
    });

    it('should emit no values', done => {
      blockingQueue.element.subscribe(val => callSpy(val));

      setTimeout(() => {
        expect(callSpy).not.toHaveBeenCalled();
        done();
      });
    });

    it('should emit no values', done => {
      blockingQueue.element.subscribe(val => callSpy(val));

      blockingQueue.push(testValue);

      setTimeout(() => {
        expect(callSpy).toHaveBeenCalledWith(testValue);
        done();
      });
    });
  });

  describe('constructing with params', () => {
    let testArray = [1, 2, 3];

    beforeEach(() => {
      blockingQueue = new BlockingQueue(testArray);
    });

    it('should create instance of BlockingQueue', () => {
      expect(blockingQueue).toBeTruthy();
      expect(blockingQueue.size).toBeGreaterThan(0);
    });

    it('should emit one value and wait', done => {
      const spy = jasmine.createSpy('valueSpy');
      blockingQueue.element.subscribe(val => spy(val));

      setTimeout(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(testArray[0]);
        done();
      }, 10);
    });

    it('should emit all values', done => {
      let index = 0;

      blockingQueue.element.subscribe(val => {
        callSpy(val);
        expect(val).toEqual(testArray[index++]);
        blockingQueue.next();
      });

      setTimeout(() => {
        expect(callSpy).toHaveBeenCalledTimes(testArray.length);
        done();
      }, 10);
    });

    it('should emit all values, and then add new value', done => {
      let index = 0;
      let addedElement = false;

      testArray.push(4);

      blockingQueue.element
        .pipe(
          tap(() => {
            if (!blockingQueue.size && !addedElement) {
              addedElement = true;
              blockingQueue.push(testArray[3]);
            }
          })
        )
        .subscribe(val => {
          callSpy(val);
          expect(val).toEqual(testArray[index++]);
          blockingQueue.next();
        });

      setTimeout(() => {
        expect(callSpy).toHaveBeenCalledTimes(testArray.length);
        done();
      }, 10);
    });
  });
});
