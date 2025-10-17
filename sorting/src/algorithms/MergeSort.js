import { compareFunc } from "../utils.js";
import { getArrayPos, animateMerge } from "../HelperFunctions.js";

export async function MergeSort(arrayElements, order, mode, speed) {
  const compare = compareFunc(order);
  const prevPos = getArrayPos(arrayElements.length);

  async function merge(left, right, startIndex, prevPos) {
    const result = [];
    let i = 0,
      j = 0;
    let curIndex = startIndex;

    await animateMerge(left, right, startIndex, compare, mode, speed, prevPos);

    while (i < left.length && j < right.length) {
      if (compare(left[i].props.value, right[j].props.value) < 0) {
        result.push(left[i]);
        i++;
        curIndex++;
      } else {
        result.push(right[j]);
        j++;
        curIndex++;
      }
    }

    while (i < left.length) {
      result.push(left[i]);
      i++;
      curIndex++;
    }

    while (j < right.length) {
      result.push(right[j]);
      j++;
      curIndex++;
    }

    return result;
  }

  async function mergeSortFunc(start = 0, end = arrayElements.length) {
    if (end - start <= 1) {
      return arrayElements.slice(start, end);
    }

    const mid = Math.floor((start + end) / 2);

    const left = await mergeSortFunc(start, mid);
    const right = await mergeSortFunc(mid, end);

    const merged = await merge(left, right, start, prevPos);

    for (let k = 0; k < merged.length; k++) {
      arrayElements[start + k] = merged[k];
    }

    return merged;
  }

  await mergeSortFunc();

  return arrayElements;
}
