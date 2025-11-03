import { sleep } from "./utils";

function getTranslateXY(element) {
  let style = window.getComputedStyle(element);
  let matrix = new DOMMatrixReadOnly(style.transform);
  return [matrix.m41, matrix.m42];
}

export async function swapElements(index1, index2, mode, speed, animate = false) {
  const elem1 = document.querySelector(`.array-element-${index1}`);
  const elem2 = document.querySelector(`.array-element-${index2}`);
  elem1.style.setProperty("--element-speed", speed + "ms");
  elem2.style.setProperty("--element-speed", speed + "ms");

  const offset1 = elem1.getBoundingClientRect();
  const offset2 = elem2.getBoundingClientRect();
  const [prevX1, prevY1] = getTranslateXY(elem1);
  const [prevX2, prevY2] = getTranslateXY(elem2);

  const dx = offset2.left - offset1.left;
  const dy = offset2.top - offset1.top;

  if (mode && animate) {
    // Step 1: Lift up and drop down
    elem1.style.transform = `translateX(${prevX1}px) translateY(${prevY1 - 80}px)`;
    elem2.style.transform = `translateX(${prevX2}px) translateY(${prevY2 + 80}px)`;
    await sleep(speed);

    // Step 2: Swap positions horizontally
    elem1.style.transform = `translateX(${dx + prevX1}px) translateY(${(mode ? dy : 0) + prevY1 - 80}px)`;
    elem2.style.transform = `translateX(${-dx + prevX2}px) translateY(${(mode ? -dy : 0) + prevY2 + 80}px)`;
    await sleep(speed);

    // Step 3: Return to level
    elem1.style.transform = `translateX(${dx + prevX1}px) translateY(${(mode ? dy : 0) + prevY1}px)`;
    elem2.style.transform = `translateX(${-dx + prevX2}px) translateY(${(mode ? -dy : 0) + prevY2}px)`;
  } else {
    // Basic swap without up/down movement
    elem1.style.transform = `translateX(${dx + prevX1}px) translateY(${(mode ? dy : 0) + prevY1}px)`;
    elem2.style.transform = `translateX(${-dx + prevX2}px) translateY(${(mode ? -dy : 0) + prevY2}px)`;
  }
  await sleep(speed);

  // Update class names and index-based styling
  elem1.classList.add(`array-element-${index2}`);
  elem1.classList.remove(`array-element-${index1}`);
  elem1.children[0].style.setProperty("--array-element-in-delay", index2);
  elem1.children[1].style.setProperty("--array-element-in-delay", index2);

  elem2.classList.add(`array-element-${index1}`);
  elem2.classList.remove(`array-element-${index2}`);
  elem2.children[0].style.setProperty("--array-element-in-delay", index1);
  elem2.children[1].style.setProperty("--array-element-in-delay", index1);
}

export async function compareElements(index1, index2, mode, speed, swap = false) {
  document.querySelector(`.array-element-${index1}`).style.setProperty("--element-speed", speed + "ms");
  document.querySelector(`.array-element-${index2}`).style.setProperty("--element-speed", speed + "ms");

  if (mode) {
    let [prevPosX1, prevPosY1] = getTranslateXY(document.querySelector(`.array-element-${index1}`));
    let [prevPosX2, prevPosY2] = getTranslateXY(document.querySelector(`.array-element-${index2}`));
    document.querySelector(`.array-element-${index1}`).style.transform = `translateX(${prevPosX1}px) translateY(${prevPosY1 - 100}px)`;
    document.querySelector(`.array-element-${index2}`).style.transform = `translateX(${prevPosX2}px) translateY(${prevPosY2 - 100}px)`;
    await sleep(speed);
    if (swap) await swapElements(index1, index2, mode, speed);
    let [newPosX1, newPosY1] = getTranslateXY(document.querySelector(`.array-element-${index1}`));
    let [newPosX2, newPosY2] = getTranslateXY(document.querySelector(`.array-element-${index2}`));
    document.querySelector(`.array-element-${index1}`).style.transform = `translateX(${newPosX1}px) translateY(${newPosY1 + 100}px)`;
    document.querySelector(`.array-element-${index2}`).style.transform = `translateX(${newPosX2}px) translateY(${newPosY2 + 100}px)`;
  } else {
    const element1 = document.querySelector(`.array-element-${index1} > .array-element`);
    const element2 = document.querySelector(`.array-element-${index2} > .array-element`);

    element1.classList.add("comparing-element");
    element2.classList.add("comparing-element");
    await sleep(speed);

    if (swap) await swapElements(index1, index2, mode, speed);

    element1.classList.remove("comparing-element");
    element2.classList.remove("comparing-element");
  }
}

export async function insertElement(elementIndex, insertIndex, mode, speed, animate = false) {
  const direction = elementIndex < insertIndex ? 1 : -1;
  let curIndex = elementIndex + direction;
  const insertElem = document.querySelector(`.array-element-${elementIndex}`);
  const targetElem = document.querySelector(`.array-element-${insertIndex}`);
  insertElem.style.setProperty("--element-speed", speed + "ms");
  targetElem.style.setProperty("--element-speed", speed + "ms");
  let prevElement = insertElem;
  let prevPos = prevElement.getBoundingClientRect();
  let targetPrevPos = targetElem.getBoundingClientRect();
  const insertDx = targetPrevPos.left - prevPos.left;
  const [insertPrevX1, insertPrevY1] = getTranslateXY(insertElem);

  if (mode && animate) {
    insertElem.style.transform = `translateX(${insertPrevX1}px) translateY(${insertPrevY1 - 80}px)`;
    await sleep(speed);
  }

  while (curIndex !== insertIndex + direction) {
    const element = document.querySelector(`.array-element-${curIndex}`);
    element.style.setProperty("--element-speed", speed + "ms");
    element.style.setProperty("--element-speed", speed + "ms");
    const curPos = element.getBoundingClientRect();
    const dx = prevPos.left - curPos.left;
    const dy = prevPos.top - curPos.top;
    const [prevX1, prevY1] = getTranslateXY(element);

    element.style.transform = `translateX(${dx + prevX1}px) translateY(${(mode ? dy : 0) + prevY1}px)`;
    element.classList.remove(`array-element-${curIndex}`);
    element.classList.add(`array-element-${curIndex - direction}`);
    prevElement = element;
    prevPos = prevElement.getBoundingClientRect();
    curIndex += direction;
    await sleep(speed);
  }

  if (mode && animate) {
    insertElem.style.transform = `translateX(${insertDx + insertPrevX1}px) translateY(${insertPrevY1 - 80}px)`;
    await sleep(speed);
  }

  insertElem.style.transform = `translateX(${insertDx + insertPrevX1}px) translateY(${insertPrevY1}px)`;

  insertElem.classList.remove(`array-element-${elementIndex}`);
  insertElem.classList.add(`array-element-${insertIndex}`);
}

export function getArrayPos(len) {
  const prevPos = [];
  for (let index = 0; index < len; index++) {
    const element = document.querySelector(`.array-element-${index}`);
    const offset = element.getBoundingClientRect();
    prevPos.push(offset);
  }
  return prevPos;
}

export async function moveTo(index, rect, mode, speed, animate = false, offset = 0) {
  const element = document.querySelector(`.array-element-${index}`);
  element.style.setProperty("--element-speed", speed + "ms");

  const offset1 = element.getBoundingClientRect();
  const offset2 = rect;
  const [prevX1, prevY1] = getTranslateXY(element);

  const dx = offset2.left - offset1.left;
  const dy = offset2.top - offset1.top;

  if (mode && animate) {
    element.style.transform = `translateX(${prevX1}px) translateY(${prevY1 + offset}px)`;
    await sleep(speed);
    element.style.transform = `translateX(${dx + prevX1}px) translateY(${dy + prevY1 + offset}px)`;
    await sleep(speed);
    element.style.transform = `translateX(${dx + prevX1}px) translateY(${dy + prevY1}px)`;
  } else {
    element.style.transform = `translateX(${dx + prevX1}px) translateY(${(mode ? dy : 0) + prevY1}px)`;
  }
  await sleep(speed);
}

export async function animateMerge(left, right, startIndex, compare, mode, speed, prevPos) {
  let curIndex = startIndex;

  if (mode) {
    for (let i = 0; i < left.length + right.length; i++) {
      const element = document.querySelector(`.array-element-${curIndex + i}`);
      element.style.setProperty("--element-speed", speed + "ms");
      const [prevX, prevY] = getTranslateXY(element);
      element.style.transform = `translateX(${prevX}px) translateY(${prevY - 80}px)`;
    }
    await sleep(speed);
  }

  let i = 0,
    j = 0;
  const elements = [];

  while (i < left.length && j < right.length) {
    if (compare(left[i].props.value, right[j].props.value) < 0) {
      const element = document.querySelector(`.array-element-${startIndex + i}`);
      await moveTo(startIndex + i, prevPos[curIndex], mode, speed);
      elements.push({ index: startIndex + i, element: element });
      i++;
    } else {
      const element = document.querySelector(`.array-element-${startIndex + left.length + j}`);
      await moveTo(startIndex + left.length + j, prevPos[curIndex], mode, speed);
      elements.push({ index: startIndex + left.length + j, element: element });
      j++;
    }
    curIndex++;
  }

  while (i < left.length) {
    const element = document.querySelector(`.array-element-${startIndex + i}`);
    await moveTo(startIndex + i, prevPos[curIndex], mode, speed);
    elements.push({ index: startIndex + i, element: element });
    i++;
    curIndex++;
  }

  while (j < right.length) {
    const element = document.querySelector(`.array-element-${startIndex + left.length + j}`);
    await moveTo(startIndex + left.length + j, prevPos[curIndex], mode, speed);
    elements.push({ index: startIndex + left.length + j, element: element });
    j++;
    curIndex++;
  }

  curIndex = startIndex;

  for (const { index, element } of elements) {
    element.classList.remove(`array-element-${index}`);
  }
  for (const { element } of elements) {
    element.classList.add(`array-element-${curIndex}`);
    element.children[0].style.setProperty("--array-element-in-delay", curIndex);
    curIndex++;
  }
}

export async function showOutput(state, seconds = "", msg = "") {
  let toastIcon = "";
  let toastMsg = "";
  if (state === "sorted") {
    toastIcon = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 80 80">
          <path fill="#bae0bd" d="M40,77.5C19.3,77.5,2.5,60.7,2.5,40S19.3,2.5,40,2.5S77.5,19.3,77.5,40S60.7,77.5,40,77.5z"></path>
          <path fill="#5e9c76" d="M40,3c20.4,0,37,16.6,37,37S60.4,77,40,77S3,60.4,3,40S19.6,3,40,3 M40,2C19,2,2,19,2,40s17,38,38,38 s38-17,38-38S61,2,40,2L40,2z"></path>
          <path fill="#fff" d="M34 56L20.2 42.2 24.5 38 34 47.6 58.2 23.4 62.5 27.6z"></path>
        </svg>`;
    toastMsg = `<span class="toast-msg">Array sorted in ${seconds} seconds!</span>`;
  } else if (state === "notFound") {
    toastIcon = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 26 26" style="fill: #FA5252">
          <path d="M 13 0.1875 C 5.925781 0.1875 0.1875 5.925781 0.1875 13 C 0.1875 20.074219 5.925781 25.8125 13 25.8125 C 20.074219 25.8125 25.8125 20.074219 25.8125 13 C 25.8125 5.925781 20.074219 0.1875 13 0.1875 Z M 18.78125 17.394531 L 17.390625 18.78125 C 17.136719 19.035156 16.722656 19.035156 16.46875 18.78125 L 13 15.3125 L 9.53125 18.78125 C 9.277344 19.035156 8.863281 19.035156 8.609375 18.777344 L 7.21875 17.394531 C 6.96875 17.136719 6.96875 16.726563 7.21875 16.46875 L 10.6875 13 L 7.222656 9.535156 C 6.96875 9.277344 6.96875 8.863281 7.222656 8.609375 L 8.609375 7.222656 C 8.863281 6.964844 9.28125 6.964844 9.535156 7.222656 L 13 10.6875 L 16.46875 7.222656 C 16.722656 6.964844 17.140625 6.964844 17.390625 7.222656 L 18.78125 8.605469 C 19.035156 8.863281 19.035156 9.277344 18.78125 9.535156 L 15.3125 13 L 18.78125 16.46875 C 19.03125 16.726563 19.03125 17.136719 18.78125 17.394531 Z"></path>
        </svg>`;
    toastMsg = `<span class="toast-msg">Element not in array!</span>`;
  } else if (state === "enterTarget") {
    toastIcon = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 111.24" height="20" width="20"><defs><style>.cls-1{fill:#eece5a;fill-rule:evenodd;}.cls-2{fill:#2a2a2a;}</style></defs><title>risk</title><path d="M2.5,85l43-74.41h0a22.59,22.59,0,0,1,8-8.35,15.72,15.72,0,0,1,16,0,22.52,22.52,0,0,1,7.93,8.38l.23.44,42.08,73.07a20.91,20.91,0,0,1,3,10.84A16.44,16.44,0,0,1,121,102.4a15.45,15.45,0,0,1-5.74,6,21,21,0,0,1-11.35,2.78v0H17.7c-.21,0-.43,0-.64,0a19,19,0,0,1-7.83-1.74,15.83,15.83,0,0,1-6.65-5.72A16.26,16.26,0,0,1,0,95.18a21.66,21.66,0,0,1,2.2-9.62c.1-.2.2-.4.31-.59Z"/><path class="cls-1" d="M9.09,88.78l43-74.38c5.22-8.94,13.49-9.2,18.81,0l42.32,73.49c4.12,6.79,2.41,15.9-9.31,15.72H17.7C9.78,103.79,5,97.44,9.09,88.78Z"/><path class="cls-2" d="M57.55,83.15a5.47,5.47,0,0,1,5.85-1.22,5.65,5.65,0,0,1,2,1.3A5.49,5.49,0,0,1,67,86.77a5.12,5.12,0,0,1-.08,1.4,5.22,5.22,0,0,1-.42,1.34,5.51,5.51,0,0,1-5.2,3.25,5.63,5.63,0,0,1-2.26-.53,5.51,5.51,0,0,1-2.81-2.92A6,6,0,0,1,55.9,88a5.28,5.28,0,0,1,0-1.31h0a6,6,0,0,1,.56-2,4.6,4.6,0,0,1,1.14-1.56Zm8.12-10.21c-.19,4.78-8.28,4.78-8.46,0-.82-8.19-2.92-27.63-2.85-35.32.07-2.37,2-3.78,4.55-4.31a11.65,11.65,0,0,1,2.48-.25,12.54,12.54,0,0,1,2.5.25c2.59.56,4.63,2,4.63,4.43V38l-2.84,35Z"/></svg>`;
    toastMsg = `<span class="toast-msg">Please enter a target value to search for!</span>`;
  } else if (state === "enterInt") {
    toastIcon = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 111.24" height="20" width="20"><defs><style>.cls-1{fill:#eece5a;fill-rule:evenodd;}.cls-2{fill:#2a2a2a;}</style></defs><title>risk</title><path d="M2.5,85l43-74.41h0a22.59,22.59,0,0,1,8-8.35,15.72,15.72,0,0,1,16,0,22.52,22.52,0,0,1,7.93,8.38l.23.44,42.08,73.07a20.91,20.91,0,0,1,3,10.84A16.44,16.44,0,0,1,121,102.4a15.45,15.45,0,0,1-5.74,6,21,21,0,0,1-11.35,2.78v0H17.7c-.21,0-.43,0-.64,0a19,19,0,0,1-7.83-1.74,15.83,15.83,0,0,1-6.65-5.72A16.26,16.26,0,0,1,0,95.18a21.66,21.66,0,0,1,2.2-9.62c.1-.2.2-.4.31-.59Z"/><path class="cls-1" d="M9.09,88.78l43-74.38c5.22-8.94,13.49-9.2,18.81,0l42.32,73.49c4.12,6.79,2.41,15.9-9.31,15.72H17.7C9.78,103.79,5,97.44,9.09,88.78Z"/><path class="cls-2" d="M57.55,83.15a5.47,5.47,0,0,1,5.85-1.22,5.65,5.65,0,0,1,2,1.3A5.49,5.49,0,0,1,67,86.77a5.12,5.12,0,0,1-.08,1.4,5.22,5.22,0,0,1-.42,1.34,5.51,5.51,0,0,1-5.2,3.25,5.63,5.63,0,0,1-2.26-.53,5.51,5.51,0,0,1-2.81-2.92A6,6,0,0,1,55.9,88a5.28,5.28,0,0,1,0-1.31h0a6,6,0,0,1,.56-2,4.6,4.6,0,0,1,1.14-1.56Zm8.12-10.21c-.19,4.78-8.28,4.78-8.46,0-.82-8.19-2.92-27.63-2.85-35.32.07-2.37,2-3.78,4.55-4.31a11.65,11.65,0,0,1,2.48-.25,12.54,12.54,0,0,1,2.5.25c2.59.56,4.63,2,4.63,4.43V38l-2.84,35Z"/></svg>`;
    toastMsg = `<span class="toast-msg">Please enter a integer value to search!</span>`;
  } else if (state === "incorrectArrayFormat") {
    toastIcon = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 111.24" height="20" width="20"><defs><style>.cls-1{fill:#eece5a;fill-rule:evenodd;}.cls-2{fill:#2a2a2a;}</style></defs><title>risk</title><path d="M2.5,85l43-74.41h0a22.59,22.59,0,0,1,8-8.35,15.72,15.72,0,0,1,16,0,22.52,22.52,0,0,1,7.93,8.38l.23.44,42.08,73.07a20.91,20.91,0,0,1,3,10.84A16.44,16.44,0,0,1,121,102.4a15.45,15.45,0,0,1-5.74,6,21,21,0,0,1-11.35,2.78v0H17.7c-.21,0-.43,0-.64,0a19,19,0,0,1-7.83-1.74,15.83,15.83,0,0,1-6.65-5.72A16.26,16.26,0,0,1,0,95.18a21.66,21.66,0,0,1,2.2-9.62c.1-.2.2-.4.31-.59Z"/><path class="cls-1" d="M9.09,88.78l43-74.38c5.22-8.94,13.49-9.2,18.81,0l42.32,73.49c4.12,6.79,2.41,15.9-9.31,15.72H17.7C9.78,103.79,5,97.44,9.09,88.78Z"/><path class="cls-2" d="M57.55,83.15a5.47,5.47,0,0,1,5.85-1.22,5.65,5.65,0,0,1,2,1.3A5.49,5.49,0,0,1,67,86.77a5.12,5.12,0,0,1-.08,1.4,5.22,5.22,0,0,1-.42,1.34,5.51,5.51,0,0,1-5.2,3.25,5.63,5.63,0,0,1-2.26-.53,5.51,5.51,0,0,1-2.81-2.92A6,6,0,0,1,55.9,88a5.28,5.28,0,0,1,0-1.31h0a6,6,0,0,1,.56-2,4.6,4.6,0,0,1,1.14-1.56Zm8.12-10.21c-.19,4.78-8.28,4.78-8.46,0-.82-8.19-2.92-27.63-2.85-35.32.07-2.37,2-3.78,4.55-4.31a11.65,11.65,0,0,1,2.48-.25,12.54,12.54,0,0,1,2.5.25c2.59.56,4.63,2,4.63,4.43V38l-2.84,35Z"/></svg>`;
    toastMsg = `<span class="toast-msg">Please enter array in the specified format!</span>`;
  } else if (state === "enterArrayElements") {
    toastIcon = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 111.24" height="20" width="20"><defs><style>.cls-1{fill:#eece5a;fill-rule:evenodd;}.cls-2{fill:#2a2a2a;}</style></defs><title>risk</title><path d="M2.5,85l43-74.41h0a22.59,22.59,0,0,1,8-8.35,15.72,15.72,0,0,1,16,0,22.52,22.52,0,0,1,7.93,8.38l.23.44,42.08,73.07a20.91,20.91,0,0,1,3,10.84A16.44,16.44,0,0,1,121,102.4a15.45,15.45,0,0,1-5.74,6,21,21,0,0,1-11.35,2.78v0H17.7c-.21,0-.43,0-.64,0a19,19,0,0,1-7.83-1.74,15.83,15.83,0,0,1-6.65-5.72A16.26,16.26,0,0,1,0,95.18a21.66,21.66,0,0,1,2.2-9.62c.1-.2.2-.4.31-.59Z"/><path class="cls-1" d="M9.09,88.78l43-74.38c5.22-8.94,13.49-9.2,18.81,0l42.32,73.49c4.12,6.79,2.41,15.9-9.31,15.72H17.7C9.78,103.79,5,97.44,9.09,88.78Z"/><path class="cls-2" d="M57.55,83.15a5.47,5.47,0,0,1,5.85-1.22,5.65,5.65,0,0,1,2,1.3A5.49,5.49,0,0,1,67,86.77a5.12,5.12,0,0,1-.08,1.4,5.22,5.22,0,0,1-.42,1.34,5.51,5.51,0,0,1-5.2,3.25,5.63,5.63,0,0,1-2.26-.53,5.51,5.51,0,0,1-2.81-2.92A6,6,0,0,1,55.9,88a5.28,5.28,0,0,1,0-1.31h0a6,6,0,0,1,.56-2,4.6,4.6,0,0,1,1.14-1.56Zm8.12-10.21c-.19,4.78-8.28,4.78-8.46,0-.82-8.19-2.92-27.63-2.85-35.32.07-2.37,2-3.78,4.55-4.31a11.65,11.65,0,0,1,2.48-.25,12.54,12.54,0,0,1,2.5.25c2.59.56,4.63,2,4.63,4.43V38l-2.84,35Z"/></svg>`;
    toastMsg = `<span class="toast-msg">Please enter elements to be put in array!</span>`;
  } else if (state === "info") {
    toastIcon = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24"
    style="fill:#228BE6;">
        <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 9 L 13 9 L 13 7 L 11 7 z M 11 11 L 11 17 L 13 17 L 13 11 L 11 11 z"></path>
    </svg>`;
    toastMsg = `<span class="toast-msg">${msg}</span>`;
  }

  let toastIconDiv = document.createElement("div");
  toastIconDiv.style.transform = "scale(0) rotate(60deg)";
  toastIconDiv.style.transition = "transform 0.5s";
  toastIconDiv.innerHTML = toastIcon;

  let toastMsgDiv = document.createElement("div");
  toastMsgDiv.innerHTML = toastMsg;

  let toastProgressDiv = document.createElement("div");
  toastProgressDiv.classList.add("toast-progress-bar");

  let toast = document.createElement("div");
  toast.classList.add("toast");
  toast.appendChild(toastIconDiv);
  toast.appendChild(toastMsgDiv);
  toast.appendChild(toastProgressDiv);

  document.querySelector(".toast-sibling").insertAdjacentElement("afterend", toast);
  await sleep(100);
  toast.classList.add("show-toast");
  setTimeout(() => (toastIconDiv.style.transform = "scale(1) rotate(0)"), 1000);
  setTimeout(() => {
    toastProgressDiv.style.width = "0";
    toastProgressDiv.style.borderBottomRightRadius = "0";
  }, 1000);

  setTimeout(() => {
    toast.classList.add("hide-toast");
    setTimeout(() => {
      toast.classList.remove("show-toast");
      toast.classList.remove("hide-toast");
      toast.remove();
    }, 2000);
  }, 3000);
}
