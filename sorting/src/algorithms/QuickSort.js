import { compareFunc } from "../utils.js";
import { getArrayPos, moveTo } from "../HelperFunctions.js";

export async function QuickSort(arrayElements, order, mode, speed) {
  const compare = compareFunc(order);
  const len = arrayElements.length;
  const arrayPos = getArrayPos(len);

  // Could mark pivot with border

  async function QuickSortFunc(low, high) {
    if (low < high) {
      const pivotIndex = await partition(low, high);
      await QuickSortFunc(low, pivotIndex - 1);
      await QuickSortFunc(pivotIndex + 1, high);
    }
  }

  async function partition(low, high) {
    const pivot = arrayElements[high];
    const pivotValue = pivot.props.value;

    const lessThan = [];
    const greaterThan = [];

    for (let i = low; i < high; i++) {
      const val = arrayElements[i].props.value;
      if (compare(val, pivotValue) < 0) {
        lessThan.push(i);
      } else {
        greaterThan.push(i);
      }
    }

    const pivotFinalIndex = low + lessThan.length;
    const pivotPos = low + lessThan.length;
    const tempPivotPos = { ...arrayPos[pivotPos] };
    tempPivotPos.top -= 80;
    await moveTo(high, tempPivotPos, mode, speed, true, -80);

    const lessAnimations = lessThan.map((index, i) => {
      return moveTo(index, arrayPos[low + i], mode, speed, true, 80);
    });

    const greaterAnimations = greaterThan.map((index, i) => {
      const posIndex = low + lessThan.length + 1 + i;
      return moveTo(index, arrayPos[posIndex], mode, speed, true, -80);
    });

    await Promise.all([...lessAnimations, ...greaterAnimations]);

    await moveTo(high, arrayPos[pivotPos], mode, speed, true);

    const newOrder = [...lessThan, high, ...greaterThan];
    const temp = newOrder.map((index) => arrayElements[index]);
    for (let i = 0; i < temp.length; i++) {
      arrayElements[low + i] = temp[i];
    }

    const updates = newOrder.map((index, i) => {
      const element = document.querySelector(`.array-element-${index}`);
      return { element, oldIndex: index, newIndex: low + i };
    });

    updates.forEach(({ element, oldIndex, newIndex }) => {
      element.classList.remove(`array-element-${oldIndex}`);
      element.classList.add(`array-element-${newIndex}`);
      element.children[0].style.setProperty("--array-element-in-delay", newIndex);
    });

    return pivotFinalIndex;
  }

  await QuickSortFunc(0, len - 1);
  return arrayElements;
}
