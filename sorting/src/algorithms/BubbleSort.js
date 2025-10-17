import { compareFunc } from "../utils.js";
import { compareElements } from "../HelperFunctions.js";
import { sleep } from "../utils.js";

export async function BubbleSort(arrayElements, order, mode, speed) {
  const compare = compareFunc(order);
  const len = arrayElements.length;

  for (let indexI = 0; indexI < len; indexI++) {
    for (let indexJ = 0; indexJ < len - 1 - indexI; indexJ++) {
      if (compare(arrayElements[indexJ].props.value, arrayElements[indexJ + 1].props.value) > 0) {
        await compareElements(indexJ, indexJ + 1, mode, speed, true);
        [arrayElements[indexJ], arrayElements[indexJ + 1]] = [arrayElements[indexJ + 1], arrayElements[indexJ]];
        await sleep(speed);
        continue;
      }
      await compareElements(indexJ, indexJ + 1, mode, speed);
      await sleep(speed);
    }
  }

  return arrayElements;
}
