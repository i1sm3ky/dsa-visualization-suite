import { moveTo, showOutput } from "./HelperFunctions.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const TernarySearch = async (arrayElements, target, speed) => {
  document.querySelector(".checking-element > .element-value").innerHTML = target;
  document.querySelectorAll("button").forEach((btn) => (btn.disabled = true));
  document.querySelectorAll("input").forEach((btn) => (btn.disabled = true));
  let elementFound = false;
  let low = 0;
  let high = arrayElements.length - 1;

  moveTo(".checking-element", ".array-element-0");
  moveTo(".low", ".array-element-0");
  moveTo(".high", ".array-element-0");
  moveTo(".mid-1", ".array-element-0");
  moveTo(".mid-2", ".array-element-0");

  // removing previously applied class for found element
  if (document.querySelector(".found")) document.querySelector(".found").classList.remove("found");
  document.querySelectorAll(".grey-out").forEach((element) => element.classList.remove("grey-out"));
  document.querySelector(".checking-element").style.visibility = "initial";
  document.querySelector(".low").style.visibility = "initial";
  document.querySelector(".high").style.visibility = "initial";
  document.querySelector(".mid-1").style.visibility = "initial";
  document.querySelector(".mid-2").style.visibility = "initial";

  while (low <= high) {
    moveTo(".low", `.array-element-${low}`, speed, "", 0);
    moveTo(".high", `.array-element-${high}`, speed, "", 0);

    for (let index = 0, count = 0; index < low; index++) setTimeout(() => document.querySelector(`.array-element-${index}`).classList.add("grey-out-binary"), count++ * 10);
    for (let index = arrayElements.length - 1, count = 0; index > high; index--) setTimeout(() => document.querySelector(`.array-element-${index}`).classList.add("grey-out-binary"), count++ * 10);

    let mid1 = low + Math.floor((high - low) / 3);
    let mid2 = high - Math.floor((high - low) / 3);

    if (low === high) {
      document.querySelector(".low").style.opacity = 0;
      document.querySelector(".high").style.opacity = 0;
    }

    // checking first mid
    moveTo(".checking-element", `.array-element-${mid1}`, speed, "compare");
    moveTo(".mid-1", `.array-element-${mid1}`, speed, "compareKey", 0);
    moveTo(".mid-2", `.array-element-${mid2}`, speed, "", 0);
    if (low === mid1) moveTo(".low", `.array-element-${mid1}`, speed, "compareKey", 0);
    if (high === mid1) moveTo(".high", `.array-element-${mid1}`, speed, "compareKey", 0);
    if (mid1 === mid2) {
      moveTo(".mid-2", `.array-element-${mid2}`, speed, "compareKey", 0);
      setTimeout(() => (document.querySelector(".mid-2").style.opacity = 0), speed - 150);
    }
    await sleep(speed);

    if (arrayElements[mid1].props.value === target) {
      for (let index = 0, count = 0; index < mid1; index++) setTimeout(() => document.querySelector(`.array-element-${index}`).classList.add("grey-out-binary"), count++ * 10);
      for (let index = arrayElements.length - 1, count = 0; index > mid1; index--) setTimeout(() => document.querySelector(`.array-element-${index}`).classList.add("grey-out-binary"), count++ * 10);
      document.querySelector(`.array-element-${mid1}`).classList.add("found");
      showOutput("found", mid1);
      moveTo(".checking-element", `.array-element-${mid1}`, speed, "merge");
      document.querySelector(".low").style.opacity = 0;
      document.querySelector(".high").style.opacity = 0;
      document.querySelector(".mid-1").style.opacity = 0;
      document.querySelector(".mid-2").style.opacity = 0;
      await sleep(speed);
      elementFound = true;
      break;
    }
    if (mid1 === mid2) {
      break;
    }

    // checking second mid
    moveTo(".checking-element", `.array-element-${mid2}`, speed, "compare");
    moveTo(".mid-2", `.array-element-${mid2}`, speed, "compareKey", 0);
    if (low === mid2) moveTo(".low", `.array-element-${mid2}`, speed, "compareKey", 0);
    if (high === mid2) moveTo(".high", `.array-element-${mid2}`, speed, "compareKey", 0);
    if (mid1 === mid2) {
      moveTo(".mid-1", `.array-element-${mid1}`, speed, "compareKey", 0);
      setTimeout(() => (document.querySelector(".mid-1").style.opacity = 0), speed - 150);
    }
    await sleep(speed);

    if (arrayElements[mid2].props.value === target) {
      for (let index = 0, count = 0; index < mid2; index++) setTimeout(() => document.querySelector(`.array-element-${index}`).classList.add("grey-out-binary"), count++ * 10);
      for (let index = arrayElements.length - 1, count = 0; index > mid2; index--) setTimeout(() => document.querySelector(`.array-element-${index}`).classList.add("grey-out-binary"), count++ * 10);
      document.querySelector(`.array-element-${mid2}`).classList.add("found");
      showOutput("found", mid2);
      moveTo(".checking-element", `.array-element-${mid2}`, speed, "merge");
      document.querySelector(".low").style.opacity = 0;
      document.querySelector(".high").style.opacity = 0;
      document.querySelector(".mid-1").style.opacity = 0;
      document.querySelector(".mid-2").style.opacity = 0;
      await sleep(speed);
      elementFound = true;
      break;
    }

    if (arrayElements[mid1].props.value > target) {
      high = mid1 - 1;
    } else if (arrayElements[mid2].props.value < target) {
      low = mid2 + 1;
    } else {
      low = mid1 + 1;
      high = mid2 - 1;
    }
  }

  document.querySelector(".low").style.opacity = 0;
  document.querySelector(".high").style.opacity = 0;
  document.querySelector(".mid-1").style.opacity = 0;
  document.querySelector(".mid-2").style.opacity = 0;

  document.querySelector(".checking-element").style.visibility = "hidden";
  document.querySelector(".low").style.visibility = "hidden";
  document.querySelector(".high").style.visibility = "hidden";
  document.querySelector(".mid-1").style.visibility = "hidden";
  document.querySelector(".mid-2").style.visibility = "hidden";
  if (!elementFound) {
    showOutput("notFound");
    document.querySelector(".checking-element").style.opacity = 0;
    if (document.querySelector(`.array-element-${low}`)) document.querySelector(`.array-element-${low}`).classList.add("grey-out-binary");
    if (document.querySelector(`.array-element-${low + 1}`)) document.querySelector(`.array-element-${low + 1}`).classList.add("grey-out-binary");
  }
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
  moveTo(".mid-1", ".array-element-0");
  moveTo(".mid-2", ".array-element-0");
  document.querySelector(".low").style.opacity = 0.5;
  document.querySelector(".high").style.opacity = 0.5;
  document.querySelector(".mid-1").style.opacity = 0.5;
  document.querySelector(".mid-2").style.opacity = 0.5;
  setTimeout(() => {
    document.querySelectorAll("button").forEach((btn) => (btn.disabled = false));
    document.querySelector(".disabled-algorithm-btn").disabled = true;
    document.querySelectorAll("input").forEach((btn) => (btn.disabled = false));
  }, greyedOutElements.length * 100 + 1000);
};

export default TernarySearch;
