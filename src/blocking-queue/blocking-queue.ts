import { Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export class BlockingQueue<T> {
  private readonly elements: T[];
  private readonly current$: ReplaySubject<T> = new ReplaySubject(1);
  private blocked = false;

  constructor(elements?: T[]) {
    this.elements = [...(elements || [])];

    this.emitNextElement();
  }

  get element(): Observable<T> {
    return this.current$.asObservable().pipe(tap(() => (this.blocked = true)));
  }

  get waitingElements() {
    return this.elements.length;
  }

  next() {
    this.blocked = false;
    this.emitNextElement();
  }

  addElement(element: T) {
    this.elements.push(element);
    if (!this.blocked) {
      this.emitNextElement();
    }
  }

  private emitNextElement() {
    if (this.waitingElements) {
      this.blocked = true;
      this.current$.next(this.elements.shift());
    }
  }
}
