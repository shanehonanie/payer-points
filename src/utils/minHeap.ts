import { AddPointsRecord, SpendPointsPayload } from '../types/payer';
import { calcEpoch } from './utils';

export class MinimumHeap {
  public heap: Array<AddPointsRecord> = [];
  private totalPoints: number = 0;

  constructor() {}

  public peek = (): SpendPointsPayload => {
    return this.heap[0];
  };

  public insert = (addPointsRecord: AddPointsRecord): void => {
    this.heap.push(addPointsRecord);
    this.totalPoints += addPointsRecord.points;
    this.siftUp(this.heap.length - 1);
  };

  public remove = (): SpendPointsPayload => {
    const value: AddPointsRecord = this.heap[0];
    const lastIndex: number = this.heap.length - 1;

    this.totalPoints -= this.peek().points;
    this.swap(0, lastIndex);
    this.heap.pop();
    this.siftDown(0);

    return value;
  };

  public changePointsForMinItem = (pointsToSpend: number): void => {
    // dont allow point redemption if greater or equal (should use remove if equal)
    if (pointsToSpend >= this.heap[0].points) return;

    this.heap[0].points -= pointsToSpend;
    this.totalPoints -= pointsToSpend;
  };

  public getTotalPoints = (): number => {
    return this.totalPoints;
  };

  private siftUp = (currentIndex: number): void => {
    let parentIndex: number = Math.ceil((currentIndex - 1) / 2);

    while (
      currentIndex > 0 &&
      calcEpoch(this.heap[currentIndex].timestamp) <
        calcEpoch(this.heap[parentIndex].timestamp)
    ) {
      this.swap(parentIndex, currentIndex);
      currentIndex = parentIndex;
      parentIndex = Math.ceil((currentIndex - 1) / 2);
    }
  };

  private siftDown = (currentIndex: number): void => {
    let minIndex: number = currentIndex;
    const size = this.heap.length;
    const leftChild: number = 2 * currentIndex + 1;

    if (
      leftChild < size &&
      calcEpoch(this.heap[leftChild].timestamp) <
        calcEpoch(this.heap[minIndex].timestamp)
    ) {
      minIndex = leftChild;
    }

    const rightChild: number = 2 * currentIndex + 2;

    if (
      rightChild < size &&
      calcEpoch(this.heap[rightChild].timestamp) <
        calcEpoch(this.heap[minIndex].timestamp)
    ) {
      minIndex = rightChild;
    }

    if (minIndex != currentIndex) {
      this.swap(minIndex, currentIndex);
      this.siftDown(minIndex);
    }
  };

  private swap = (i: number, j: number): void => {
    const temp: AddPointsRecord = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  };
}
