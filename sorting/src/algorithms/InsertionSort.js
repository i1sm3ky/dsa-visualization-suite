import { compareFunc } from "../utils.js";
import { compareElements, insertElement } from "../HelperFunctions.js";
import { sleep } from "../utils.js";

export async function InsertionSort(arrayElements, order, mode, speed) {
  const compare = compareFunc(order);
  const len = arrayElements.length;

  for (let indexI = 1; indexI < len; indexI++) {
    let key = arrayElements[indexI].props.value;
    let keyIndex = indexI;
    let indexJ = indexI - 1;

    await compareElements(indexJ, keyIndex, mode, speed);
    await sleep(speed);
    while (indexJ >= 0 && compare(arrayElements[indexJ].props.value, key) > 0) {
      await insertElement(keyIndex, indexJ, mode, speed, true);
      [arrayElements[keyIndex], arrayElements[indexJ]] = [arrayElements[indexJ], arrayElements[keyIndex]];
      keyIndex = indexJ;
      indexJ--;
      await sleep(speed);
    }
  }

  return arrayElements;
}
