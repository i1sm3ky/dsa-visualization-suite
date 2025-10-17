import { compareFunc } from "../utils.js";
import { compareElements, swapElements } from "../HelperFunctions.js";
import { sleep } from "../utils.js";

export async function SelectionSort(arrayElements, order, mode, speed) {
  const compare = compareFunc(order);
  const len = arrayElements.length;

  for (let indexI = 0; indexI < len; indexI++) {
    let minIndex = indexI;
    for (let indexJ = indexI + 1; indexJ < len; indexJ++) {
      await compareElements(minIndex, indexJ, mode, speed);
      if (compare(arrayElements[indexJ].props.value, arrayElements[minIndex].props.value) < 0) {
        minIndex = indexJ;
      }
      await sleep(speed);
    }
    if (minIndex !== indexI) {
      await swapElements(indexI, minIndex, mode, speed, true);
      [arrayElements[indexI], arrayElements[minIndex]] = [arrayElements[minIndex], arrayElements[indexI]];
      await sleep(speed);
    }
  }

  return arrayElements;
}
