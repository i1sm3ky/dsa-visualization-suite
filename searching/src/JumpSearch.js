import { moveTo, showOutput } from "./HelperFunctions.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const JumpSearch = async (arrayElements, target, speed) => {
  document.querySelector(".checking-element > .element-value").innerHTML = target;
  document.querySelectorAll("button").forEach((btn) => (btn.disabled = true));
  document.querySelectorAll("input").forEach((btn) => (btn.disabled = true));
  let elementFound = false;
  // removing previously applied class for found element
  if (document.querySelector(".found")) document.querySelector(".found").classList.remove("found");
  document.querySelectorAll(".grey-out").forEach((element) => element.classList.remove("grey-out"));
  document.querySelectorAll(".grey-out-binary").forEach((element) => element.classList.remove("grey-out-binary"));
  moveTo(".checking-element", `.array-element-${arrayElements.length >> 1}`);
  document.querySelector(".checking-element").style.visibility = "initial";
  document.querySelector(".checking-element").classList.add("reveal-target-element");

  let step = Math.floor(Math.sqrt(arrayElements.length));
  if (document.querySelector(".step-size").innerHTML) {
    document.querySelector(".step-size").classList.add("animate-change");
    await sleep(300);
  }
  document.querySelector(".step-size").innerHTML = step;
  document.querySelector(".step-size").classList.remove("animate-change");
  await sleep(Math.min(1000, speed + 100));

  let tempStep = 0;
  let length = arrayElements.length - 1;
  let prev = 0;

  moveTo(".prev", ".array-element-0");
  setTimeout(() => (document.querySelector(".prev").style.visibility = "initial"), 2 * Math.min(1000, speed));

  // jump search to determine the sub array
  while (arrayElements[tempStep < length ? tempStep : length].props.value <= target) {
    moveTo(".checking-element", `.array-element-${arrayElements[tempStep < length ? tempStep : length].props.index}`, speed, "compare");
    await sleep(Math.min(1000, speed));
    document.querySelector(`.array-element-${arrayElements[tempStep < length ? tempStep : length].props.index}`).classList.add("grey-out");
    prev = tempStep;
    tempStep += step;
    if (prev >= length) {
      break;
    }
    setTimeout(() => moveTo(".prev", `.array-element-${prev}`, speed, "", 0), Math.min(1000, speed));
  }
  if (prev < length && arrayElements[prev].props.value < target) {
    moveTo(".checking-element", `.array-element-${arrayElements[tempStep < length ? tempStep : length].props.index}`, speed, "compare");
    await sleep(Math.min(1000, speed));
    document.querySelector(`.array-element-${arrayElements[tempStep < length ? tempStep : length].props.index}`).classList.add("grey-out");
    prev++;
  }

  for (let index = 0, count = 0; index < prev; index++) setTimeout(() => document.querySelector(`.array-element-${index}`).classList.add("grey-out"), count++ * 100);

  // linear search the sub array
  if (prev < length) {
    while (arrayElements[prev].props.value < target) {
      moveTo(".checking-element", `.array-element-${arrayElements[prev].props.index}`, speed, "compare");
      await sleep(Math.min(1000, speed));
      document.querySelector(`.array-element-${arrayElements[prev].props.index}`).classList.add("grey-out");
      prev++;
      if (prev === (tempStep < length ? tempStep : length)) {
        break;
      }
    }

    if (arrayElements[prev].props.value === target) {
      if (prev % step != 0) {
        moveTo(".checking-element", `.array-element-${arrayElements[prev].props.index}`, speed, "compare");
        await sleep(Math.min(1000, speed));
      }
      document.querySelector(`.array-element-${arrayElements[prev].props.index}`).classList.add("found");
      showOutput("found", arrayElements[prev].props.index);
      moveTo(".checking-element", `.array-element-${arrayElements[prev].props.index}`, Math.min(1000, speed), "merge");
      await sleep(Math.min(1000, speed));
      elementFound = true;
    } else {
      moveTo(".checking-element", `.array-element-${arrayElements[prev].props.index}`, speed, "compare");
      await sleep(Math.min(1000, speed));
      document.querySelector(`.array-element-${arrayElements[prev].props.index}`).classList.add("grey-out");
    }
  }

  document.querySelector(".prev").style.opacity = 0;
  document.querySelector(".checking-element").style.visibility = "hidden";
  document.querySelector(".prev").style.visibility = "hidden";
  document.querySelector(".checking-element").classList.remove("reveal-target-element");
  if (elementFound) document.querySelector(".checking-element").classList.remove("merge");
  if (!elementFound) {
    showOutput("notFound");
    document.querySelector(".checking-element").style.opacity = 0;
  }
  await sleep(300);
  document.querySelector(".checking-element").style.opacity = 1;
  moveTo(".checking-element", `.array-element-${arrayElements.length >> 1}`);
  moveTo(".prev", ".array-element-0");
  document.querySelector(".prev").style.opacity = 0.5;
  document.querySelectorAll("button").forEach((btn) => (btn.disabled = false));
  document.querySelector(".disabled-algorithm-btn").disabled = true;
  document.querySelectorAll("input").forEach((btn) => (btn.disabled = false));
};

export default JumpSearch;
