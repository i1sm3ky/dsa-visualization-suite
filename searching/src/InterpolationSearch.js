import { moveTo, showOutput } from "./HelperFunctions.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const resetInterpolatedPosition = async () => {
  document.querySelector(".interpolated-position").classList.add("animate-change");
  await sleep(300);
  document.querySelector(".interpolated-position").innerHTML = "not calculated!";
  document.querySelector(".interpolated-position").classList.remove("animate-change");
};

const InterpolationSearch = async (arrayElements, target, speed) => {
  document.querySelector(".checking-element > .element-value").innerHTML = target;
  document.querySelectorAll("button").forEach((btn) => (btn.disabled = true));
  document.querySelectorAll("input").forEach((btn) => (btn.disabled = true));
  let elementFound = false;
  let low = 0;
  let high = arrayElements.length - 1;
  let isPosCalculated = false;

  moveTo(".checking-element", ".array-element-0");
  moveTo(".low", ".array-element-0");
  moveTo(".high", ".array-element-0");

  // removing previously applied class for found element
  if (document.querySelector(".found")) document.querySelector(".found").classList.remove("found");
  document.querySelectorAll(".grey-out").forEach((element) => element.classList.remove("grey-out"));
  document.querySelector(".checking-element").style.visibility = "initial";
  document.querySelector(".low").style.visibility = "initial";
  document.querySelector(".high").style.visibility = "initial";

  moveTo(".low", `.array-element-${low}`, speed, "", 0);
  moveTo(".high", `.array-element-${high}`, speed, "", 0);

  await sleep(Math.min(500, speed));

  while (low <= high && target >= arrayElements[low].props.value && target <= arrayElements[high].props.value) {
    isPosCalculated = true;
    if (low === high) {
      moveTo(".checking-element", `.array-element-${low}`, speed, "compare");
      moveTo(".low", `.array-element-${low}`, speed, "compareKey", 0);
      moveTo(".high", `.array-element-${high}`, speed, "compareKey", 0);
      await sleep(speed);
      if (arrayElements[low].props.value === target) {
        document.querySelector(`.array-element-${low}`).classList.add("found");
        showOutput("found", low);
        moveTo(".checking-element", `.array-element-${low}`, speed, "merge");
        document.querySelector(".low").style.opacity = 0;
        document.querySelector(".high").style.opacity = 0;
        await sleep(speed);
        elementFound = true;
        break;
      }
    }

    let pos = Math.floor(low + ((high - low) / (arrayElements[high].props.value - arrayElements[low].props.value)) * (target - arrayElements[low].props.value));
    document.querySelector(".interpolated-position").classList.add("animate-change");
    await sleep(300);
    document.querySelector(".interpolated-position").innerHTML = pos;
    document.querySelector(".interpolated-position").classList.remove("animate-change");

    moveTo(".checking-element", `.array-element-${pos}`, speed, "compare");
    if (low === pos) moveTo(".low", `.array-element-${low}`, speed, "compareKey", 0);
    if (high === pos) moveTo(".high", `.array-element-${high}`, speed, "compareKey", 0);
    await sleep(speed);

    if (arrayElements[pos].props.value === target) {
      document.querySelector(`.array-element-${[pos]}`).classList.add("found");
      showOutput("found", pos);
      moveTo(".checking-element", `.array-element-${pos}`, speed, "merge");
      document.querySelector(".low").style.opacity = 0;
      document.querySelector(".high").style.opacity = 0;
      await sleep(speed);
      elementFound = true;
      break;
    }

    if (arrayElements[pos].props.value < target) {
      low = pos + 1;
    } else {
      high = pos - 1;
    }

    await sleep(300);

    for (let index = 0, count = 0; index < low; index++) setTimeout(() => document.querySelector(`.array-element-${index}`).classList.add("grey-out-binary"), count++ * 10);
    for (let index = arrayElements.length - 1, count = 0; index > high; index--) setTimeout(() => document.querySelector(`.array-element-${index}`).classList.add("grey-out-binary"), count++ * 10);

    document.querySelector(`.array-element-${pos}`).classList.add("grey-out-binary");
    moveTo(".low", `.array-element-${low}`, speed, "", 0);
    moveTo(".high", `.array-element-${high}`, speed, "", 0);
  }

  if (!elementFound) {
    if (!isPosCalculated) resetInterpolatedPosition();
    moveTo(".checking-element", `.array-element-${low}`, speed, "compare");
    moveTo(".low", `.array-element-${low}`, speed, "compareKey", 0);
    if (low === high) moveTo(".high", `.array-element-${high}`, speed, "compareKey", 0);
    await sleep(speed);
    document.querySelector(".low").style.opacity = 0;
    document.querySelector(`.array-element-${low}`).classList.add("grey-out-binary");
    if (target > arrayElements[high].props.value && arrayElements.length > 1 && low != high) {
      moveTo(".checking-element", `.array-element-${high}`, speed, "compare");
      moveTo(".high", `.array-element-${high}`, speed, "compareKey", 0);
      await sleep(speed);
      document.querySelector(`.array-element-${high}`).classList.add("grey-out-binary");
    }
    showOutput("notFound");
    document.querySelector(".checking-element").style.opacity = 0;
  }

  document.querySelector(".high").style.opacity = 0;

  document.querySelector(".checking-element").style.visibility = "hidden";
  document.querySelector(".low").style.visibility = "hidden";
  document.querySelector(".high").style.visibility = "hidden";
  await sleep(speed + 100);
  let greyedOutElements = document.querySelectorAll(".grey-out-binary");
  for (const element of greyedOutElements) {
    element.classList.add("grey-out");
    element.classList.remove("grey-out-binary");
    element.classList.add("array-element-reveal");
    element.style.opacity = 0;
    setTimeout(() => {
      if (document.querySelectorAll(".array-element-reveal")) {
        document.querySelectorAll(".array-element-reveal").forEach((element) => {
          element.classList.remove("array-element-reveal");
          element.style.opacity = 1;
          element.style.transform = "translateY(100px)";
        });
      }
    }, greyedOutElements.length * 100 + 1000);
  }
  await sleep(300);
  document.querySelector(".checking-element").style.opacity = 1;
  moveTo(".checking-element", ".array-element-0");
  moveTo(".low", ".array-element-0");
  moveTo(".high", ".array-element-0");
  document.querySelector(".low").style.opacity = 0.5;
  document.querySelector(".high").style.opacity = 0.5;
  setTimeout(() => {
    document.querySelectorAll("button").forEach((btn) => (btn.disabled = false));
    document.querySelector(".disabled-algorithm-btn").disabled = true;
    document.querySelectorAll("input").forEach((btn) => (btn.disabled = false));
  }, greyedOutElements.length * 100 + 1000);
};

export default InterpolationSearch;
