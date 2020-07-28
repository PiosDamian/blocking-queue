import { ReplaySubject } from 'rxjs';

export class BlockingQueue<T> {
  private readonly elements: T[];
  private readonly current$: ReplaySubject<T> = new ReplaySubject(1);

  constructor(elements?: T[]) {
    if (elements) {
      this.elements = elements;
    } else {
      this.elements = [];
    }

    if (this.elements.length) {
      this.current$.next(this.elements.shift());
    }
  }
}
