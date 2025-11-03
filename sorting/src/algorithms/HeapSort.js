import { compareFunc } from "../utils.js";
import { swapElements } from "../HelperFunctions.js";

export async function HeapSort(arrayElements, order, mode, speed) {
  const compare = compareFunc(order);
  const len = arrayElements.length;

  for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
    await heapify(arrayElements, len, i, compare, mode, speed);
  }

  for (let i = len - 1; i > 0; i--) {
    [arrayElements[0], arrayElements[i]] = [arrayElements[i], arrayElements[0]];
    await swapElements(0, i, mode, speed, true);
    await heapify(arrayElements, i, 0, compare, mode, speed);
  }

  return arrayElements;
}

async function heapify(arr, heapSize, rootIndex, compare, mode, speed) {
  let best = rootIndex;
  const left = 2 * rootIndex + 1;
  const right = 2 * rootIndex + 2;

  if (left < heapSize && compare(arr[left].props.value, arr[best].props.value) > 0) {
    best = left;
  }

  if (right < heapSize && compare(arr[right].props.value, arr[best].props.value) > 0) {
    best = right;
  }

  if (best !== rootIndex) {
    [arr[rootIndex], arr[best]] = [arr[best], arr[rootIndex]];
    await swapElements(rootIndex, best, mode, speed, true);
    await heapify(arr, heapSize, best, compare, mode, speed);
  }
}
