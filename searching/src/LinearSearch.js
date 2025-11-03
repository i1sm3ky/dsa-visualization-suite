import { moveTo, showOutput } from "./HelperFunctions.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const LinearSearch = async (arrayElements, target, speed) => {
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
  await sleep(Math.min(1000, speed + 100));

  for (const element of arrayElements) {
    moveTo(".checking-element", `.array-element-${element.props.index}`, speed, "compare");
    await sleep(speed);
    document.querySelector(`.array-element-${element.props.index}`).classList.add("grey-out");

    if (element.props.value === target) {
      document.querySelector(`.array-element-${element.props.index}`).classList.add("found");
      showOutput("found", element.props.index);
      moveTo(".checking-element", `.array-element-${element.props.index}`, Math.min(1000, speed), "merge");
      await sleep(Math.min(1000, speed));
      elementFound = true;
      break;
    }
  }

  document.querySelector(".checking-element").style.visibility = "hidden";
  document.querySelector(".checking-element").classList.remove("reveal-target-element");
  if (elementFound) document.querySelector(".checking-element").classList.remove("merge");
  if (!elementFound) {
    showOutput("notFound");
    document.querySelector(".checking-element").style.opacity = 0;
  }
  await sleep(300);
  document.querySelector(".checking-element").style.opacity = 1;
  moveTo(".checking-element", `.array-element-${arrayElements.length >> 1}`);
  document.querySelectorAll("button").forEach((btn) => (btn.disabled = false));
  document.querySelector(".disabled-algorithm-btn").disabled = true;
  document.querySelectorAll("input").forEach((btn) => (btn.disabled = false));
};

export default LinearSearch;
