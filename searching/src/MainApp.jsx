import ReactDOM from "react-dom/client";
import { useEffect } from "react";

import ArrayElement from "./ArrayElement.jsx";

import LinearSearch from "./LinearSearch.js";
import BinarySearch from "./BinarySearch.js";
import TernarySearch from "./TernarySearch.js";
import JumpSearch from "./JumpSearch.js";
import InterpolationSearch from "./InterpolationSearch.js";
import { alogDetails } from "./AlgoDetails.js";
import { showOutput } from "./HelperFunctions.js";

import "./MainApp.css";

var mode = LinearSearch;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const isSorted = (arr) => {
  for (let index = 1; index < arr.length; index++) {
    if (arr[index - 1] > arr[index]) return false;
  }
  return true;
};

var arrayElementsRoot = "";

const mutateArray = async (array, mutateMode = "") => {
  if (arrayElementsRoot === "") arrayElementsRoot = ReactDOM.createRoot(document.querySelector(".array-elements-div"));

  if (mutateMode === "add") {
    let inputLength = document.querySelector(".array-length-range").value;
    while (array.length < inputLength) {
      let randInt = mode === BinarySearch || mode === TernarySearch || mode === JumpSearch || mode === InterpolationSearch ? random(Math.max(...array), Math.max(...array) + 20) : random(0, 50);
      if (!array.includes(randInt)) array.push(randInt);
    }
  }

  if (mutateMode === "remove") {
    let inputLength = document.querySelector(".array-length-range").value;
    let removeCount = 0;
    while (array.length > inputLength) {
      array.pop();
      document.querySelector(`.array-element-${array.length}`).classList.add("grey-out-binary");
      removeCount++;
    }
    await sleep(removeCount * 100 + 1100);
  }

  let arrayElements = array.map((value, index) => <ArrayElement key={index} index={index} value={value} />);
  arrayElementsRoot.render(arrayElements);

  setTimeout(() => {
    if (document.querySelectorAll(".array-element-reveal")) {
      document.querySelectorAll(".array-element-reveal").forEach((element) => {
        element.classList.remove("array-element-reveal");
        element.style.opacity = 1;
        element.style.transform = "translateY(100px)";
      });
    }
  }, array.length * 100 + 1000);

  return Promise.resolve([array, arrayElements]);
};

const MainApp = () => {
  let array = [];
  let arrayElements = [];
  let prevLength = 9;
  let arraySorted = false;
  let inputArray = "";

  let lowerBoundKey = document.createElement("div");
  lowerBoundKey.classList.add(...["color-key-div", "low-key-div"]);
  lowerBoundKey.innerHTML = `<div class="low-key"></div>
      <span class="color-key-label">Lower bound</span>`;

  let higherBoundKey = document.createElement("div");
  higherBoundKey.classList.add(...["color-key-div", "high-key-div"]);
  higherBoundKey.innerHTML = `<div class="high-key"></div>
      <span class="color-key-label">Higher bound</span>`;

  let mid1Key = document.createElement("div");
  mid1Key.classList.add(...["color-key-div", "mid-1-key-div"]);
  mid1Key.innerHTML = `<div class="mid-1-key"></div>
      <span class="color-key-label"></span>`;

  let mid2Key = document.createElement("div");
  mid2Key.classList.add(...["color-key-div", "mid-2-key-div"]);
  mid2Key.innerHTML = `<div class="mid-2-key"></div>
      <span class="color-key-label">Mid 2</span>`;

  let prevKey = document.createElement("div");
  prevKey.classList.add(...["color-key-div", "prev-key-div"]);
  prevKey.innerHTML = `<div class="prev-key"></div>
      <span class="color-key-label">Previous element</span>`;

  let stepSizeDiv = document.createElement("div");
  stepSizeDiv.classList.add("step-size-div");
  stepSizeDiv.innerHTML = `<span>Step size:</span>
      <span class="step-size animate-change"></span>`;

  let interpolatedPositionDiv = document.createElement("div");
  interpolatedPositionDiv.classList.add("interpolated-position-div");
  interpolatedPositionDiv.innerHTML = `<span>Interpolated position:</span>
      <span class="interpolated-position"></span>`;

  useEffect(() => {
    let slidingTimer;
    let doneSlidingInterval = 1000;
    let myInput = document.querySelector(".array-length-range");

    "mouseup touchend keyup".split(" ").forEach((e) => {
      myInput.addEventListener(e, () => {
        clearTimeout(slidingTimer);
        if (myInput.value) {
          slidingTimer = setTimeout(changeArrayLength, doneSlidingInterval);
        }
      });
    });

    document.querySelector(".linearSearch-btn").classList.add("disabled-algorithm-btn");
    document.querySelector(".disabled-algorithm-btn").disabled = true;
    toogleMode("linearSearch");

    generateArray();

    hljs.highlightAll();
    hljs.initLineNumbersOnLoad();

    document.addEventListener("keydown", (event) => {
      if (event.code === "Enter" && event.target.classList.contains("target-input")) document.querySelector(".search-btn").click();
      if (event.code === "Enter" && event.target.classList.contains("array-input")) document.querySelector(".insert-array-btn").click();
    });
  }, []);

  const generateArray = async (newArray = true) => {
    document.querySelector(".generate-array-btn").disabled = true;
    if (newArray) {
      array = [];
      let inputLength = document.querySelector(".array-length-range").value;
      while (array.length < inputLength) {
        let randInt = random(0, 50);
        if (!array.includes(randInt)) array.push(randInt);
      }
      arraySorted = false;
    }
    if (mode === BinarySearch || mode === TernarySearch || mode === JumpSearch || mode === InterpolationSearch) {
      if (!arraySorted) {
        arraySorted = true;
        array.sort((a, b) => a - b);
        newArray = true;
        showOutput("info", 0, `Array is sorted.`);
      }
    } else {
      arraySorted = false;
    }

    if (newArray) {
      if (document.querySelector(".array-element-0")) {
        let index = 0;
        for (; index < array.length; index++) {
          document.querySelector(`.array-element-${index}`).classList.add("grey-out-binary");
          await sleep(100);
        }
        await sleep(index * 100 + 1000);
      }
      mutateArray([]);
      await sleep(1000);
      [array, arrayElements] = await mutateArray(array).then((result) => {
        return result;
      });
    }
    setTimeout(() => (document.querySelector(".generate-array-btn").disabled = false), array.length * 100 + 1000);
  };

  const changeArrayLength = async () => {
    if (parseInt(document.querySelector(".array-length-range").value) > prevLength)
      [array, arrayElements] = await mutateArray(array, "add").then((result) => {
        return result;
      });
    if (parseInt(document.querySelector(".array-length-range").value) < prevLength)
      [array, arrayElements] = await mutateArray(array, "remove").then((result) => {
        return result;
      });

    prevLength = parseInt(document.querySelector(".array-length-range").value);
  };

  const insertArray = async () => {
    document.querySelector(".insert-array-btn").disabled = true;
    const validArray = /^(?:\d+)(?: \d+)*$/g;
    if (document.querySelector(".array-input").value == "") showOutput("enterArrayElements");
    if (document.querySelector(".array-input").value != inputArray) {
      if (validArray.test(document.querySelector(".array-input").value)) {
        let index = 0;
        for (; index < array.length; index++) {
          document.querySelector(`.array-element-${index}`).classList.add("grey-out-binary");
          await sleep(100);
        }
        await sleep(index * 100 + 1000);
        inputArray = document.querySelector(".array-input").value;
        array = inputArray.split(" ").map(Number);
        arraySorted = isSorted(array);
        if (mode === BinarySearch || mode === TernarySearch || mode === JumpSearch || mode === InterpolationSearch) {
          if (!arraySorted) {
            arraySorted = true;
            array.sort((a, b) => a - b);
            showOutput("info", 0, `Array is sorted.`);
          }
        }
        mutateArray([]);
        await sleep(1000);
        [array, arrayElements] = await mutateArray(array).then((result) => {
          return result;
        });
        // Todo: fix below if you want to have the slider animated
        // if (array.length > document.querySelector(".array-length-range").value) {
        //   for (let len = document.querySelector(".array-length-range").value; len <= array.length; len++) document.querySelector(".array-length-range").value = len;
        // } else {
        //   for (let len = array.length; len >= document.querySelector(".array-length-range").value; len--) document.querySelector(".array-length-range").value = len;
        // }
        document.querySelector(".array-length-range").value = array.length;
        document.querySelector(".array-length").innerHTML = `(${array.length})`;
        prevLength = array.length;
      } else {
        showOutput("incorrectArrayFormat");
      }
    }
    setTimeout(() => (document.querySelector(".insert-array-btn").disabled = false), array.length * 100 + 1000);
  };

  const toogleMode = async (algoName) => {
    let offset = document.querySelector(`.${algoName}-btn`).getBoundingClientRect();
    if (parseFloat(document.querySelector(".active-algo-btn").style.left) < offset.left) {
      document.querySelector(".active-algo-btn").style.width = `${parseFloat(document.querySelector(".active-algo-btn").style.width) - 10}px`;
    }
    if (parseFloat(document.querySelector(".active-algo-btn").style.left) > offset.left) {
      document.querySelector(".active-algo-btn").style.left = `${parseFloat(document.querySelector(".active-algo-btn").style.left) + 10}px`;
      document.querySelector(".active-algo-btn").style.width = `${parseFloat(document.querySelector(".active-algo-btn").style.width) - 10}px`;
    }
    await sleep(300);

    document.querySelector(".active-algo-btn").style.top = `${offset.top + window.scrollY}px`;
    document.querySelector(".active-algo-btn").style.left = `${offset.left}px`;
    document.querySelector(".active-algo-btn").style.height = `${offset.height}px`;
    document.querySelector(".active-algo-btn").style.width = `${offset.width}px`;

    document.querySelector(".disabled-algorithm-btn").disabled = false;
    document.querySelector(".disabled-algorithm-btn").classList.remove("disabled-algorithm-btn");
    document.querySelector(`.${algoName}-btn`).classList.add("disabled-algorithm-btn");
    document.querySelector(".disabled-algorithm-btn").disabled = true;

    if (algoName != "interpolationSearch") {
      if (document.querySelector(".algo-parameters-div").contains(interpolatedPositionDiv)) interpolatedPositionDiv.classList.add("animate-change");
    }
    if (algoName != "jumpSearch") {
      if (document.querySelector(".color-key-container").contains(prevKey)) {
        prevKey.classList.add("animate-change");
      }
      if (document.querySelector(".algo-parameters-div").contains(stepSizeDiv)) {
        stepSizeDiv.classList.add("animate-change");
      }
    }
    if (algoName != "ternarySearch") {
      if (document.querySelector(".color-key-container").contains(mid2Key)) mid2Key.classList.add("animate-change");
    }
    if (algoName != "binarySearch" && algoName != "ternarySearch") {
      if (document.querySelector(".color-key-container").contains(mid1Key)) mid1Key.classList.add("animate-change");
    }
    if (algoName != "binarySearch" && algoName != "ternarySearch" && algoName != "interpolationSearch") {
      if (document.querySelector(".color-key-container").contains(lowerBoundKey)) {
        lowerBoundKey.classList.add("animate-change");
        higherBoundKey.classList.add("animate-change");
      }
    }

    await sleep(150);

    if (algoName != "interpolationSearch") {
      if (document.querySelector(".algo-parameters-div").contains(interpolatedPositionDiv)) {
        document.querySelector(".algo-parameters-div").removeChild(interpolatedPositionDiv);
        interpolatedPositionDiv.classList.remove("animate-change");
      }
    }
    if (algoName != "jumpSearch") {
      if (document.querySelector(".color-key-container").contains(prevKey)) {
        document.querySelector(".color-key-container").removeChild(prevKey);
        prevKey.classList.remove("animate-change");
      }
      if (document.querySelector(".algo-parameters-div").contains(stepSizeDiv)) {
        document.querySelector(".algo-parameters-div").removeChild(stepSizeDiv);
        stepSizeDiv.classList.remove("animate-change");
      }
    }
    if (algoName != "ternarySearch") {
      if (document.querySelector(".color-key-container").contains(mid2Key)) {
        document.querySelector(".color-key-container").removeChild(mid2Key);
        mid2Key.classList.remove("animate-change");
      }
    }
    if (algoName != "binarySearch" && algoName != "ternarySearch") {
      if (document.querySelector(".color-key-container").contains(mid1Key)) {
        document.querySelector(".color-key-container").removeChild(mid1Key);
        mid1Key.classList.remove("animate-change");
      }
    }
    if (algoName != "binarySearch" && algoName != "ternarySearch" && algoName != "interpolationSearch") {
      if (document.querySelector(".color-key-container").contains(lowerBoundKey)) {
        document.querySelector(".color-key-container").removeChild(lowerBoundKey);
        document.querySelector(".color-key-container").removeChild(higherBoundKey);
        lowerBoundKey.classList.remove("animate-change");
        higherBoundKey.classList.remove("animate-change");
      }
    }

    if (algoName === "binarySearch") {
      generateArray(false);
      if (!document.querySelector(".color-key-container").contains(lowerBoundKey)) lowerBoundKey.classList.add("animate-change");
      if (!document.querySelector(".color-key-container").contains(higherBoundKey)) higherBoundKey.classList.add("animate-change");
      if (!document.querySelector(".color-key-container").contains(mid1Key)) mid1Key.classList.add("animate-change");
      document.querySelector(".color-key-container").appendChild(lowerBoundKey);
      document.querySelector(".color-key-container").appendChild(higherBoundKey);
      document.querySelector(".color-key-container").appendChild(mid1Key);
      await sleep(300);
      lowerBoundKey.classList.remove("animate-change");
      higherBoundKey.classList.remove("animate-change");
      mid1Key.classList.remove("animate-change");
      if (document.querySelector(".mid-1-key-div .color-key-label").innerHTML != "Mid") {
        document.querySelector(".mid-1-key-div .color-key-label").classList.add("animate-change");
        await sleep(150);
      }
      document.querySelector(".mid-1-key-div .color-key-label").innerHTML = "Mid";
      document.querySelector(".mid-1-key-div .color-key-label").classList.remove("animate-change");
    }
    if (algoName === "ternarySearch") {
      generateArray(false);
      if (!document.querySelector(".color-key-container").contains(lowerBoundKey)) lowerBoundKey.classList.add("animate-change");
      if (!document.querySelector(".color-key-container").contains(higherBoundKey)) higherBoundKey.classList.add("animate-change");
      if (!document.querySelector(".color-key-container").contains(mid1Key)) mid1Key.classList.add("animate-change");
      mid2Key.classList.add("animate-change");
      document.querySelector(".color-key-container").appendChild(lowerBoundKey);
      document.querySelector(".color-key-container").appendChild(higherBoundKey);
      document.querySelector(".color-key-container").appendChild(mid1Key);
      document.querySelector(".color-key-container").appendChild(mid2Key);
      await sleep(300);
      lowerBoundKey.classList.remove("animate-change");
      higherBoundKey.classList.remove("animate-change");
      mid1Key.classList.remove("animate-change");
      mid2Key.classList.remove("animate-change");
      if (document.querySelector(".mid-1-key-div .color-key-label").innerHTML != "Mid 1") {
        document.querySelector(".mid-1-key-div .color-key-label").classList.add("animate-change");
        await sleep(150);
      }
      document.querySelector(".mid-1-key-div .color-key-label").innerHTML = "Mid 1";
      document.querySelector(".mid-1-key-div .color-key-label").classList.remove("animate-change");
    }
    if (algoName === "jumpSearch") {
      generateArray(false);
      prevKey.classList.add("animate-change");
      stepSizeDiv.classList.add("animate-change");
      document.querySelector(".color-key-container").appendChild(prevKey);
      document.querySelector(".algo-parameters-div").appendChild(stepSizeDiv);
      await sleep(300);
      prevKey.classList.remove("animate-change");
      stepSizeDiv.classList.remove("animate-change");
    }
    if (algoName === "interpolationSearch") {
      generateArray(false);
      if (!document.querySelector(".color-key-container").contains(lowerBoundKey)) lowerBoundKey.classList.add("animate-change");
      if (!document.querySelector(".color-key-container").contains(higherBoundKey)) higherBoundKey.classList.add("animate-change");
      interpolatedPositionDiv.classList.add("animate-change");
      document.querySelector(".color-key-container").appendChild(lowerBoundKey);
      document.querySelector(".color-key-container").appendChild(higherBoundKey);
      document.querySelector(".algo-parameters-div").appendChild(interpolatedPositionDiv);
      await sleep(300);
      lowerBoundKey.classList.remove("animate-change");
      higherBoundKey.classList.remove("animate-change");
      interpolatedPositionDiv.classList.remove("animate-change");
    }

    document.querySelector(".algo-name").classList.add("animate-change");
    document.querySelector(".description-data").classList.add("animate-change");
    document.querySelector(".average-complexity").classList.add("animate-change");
    document.querySelector(".best-complexity").classList.add("animate-change");
    document.querySelector(".worst-complexity").classList.add("animate-change");
    document.querySelector(".space-complexity").classList.add("animate-change");
    document.querySelector(".code-block").classList.add("animate-change");

    await sleep(300);

    document.querySelector(".algo-name").innerHTML = alogDetails[algoName].title;
    document.querySelector(".description-data").innerHTML = alogDetails[algoName].description;
    document.querySelector(".average-complexity").innerHTML = alogDetails[algoName].complexities.average;
    document.querySelector(".best-complexity").innerHTML = alogDetails[algoName].complexities.best;
    document.querySelector(".worst-complexity").innerHTML = alogDetails[algoName].complexities.worst;
    document.querySelector(".space-complexity").innerHTML = alogDetails[algoName].complexities.space;
    document.querySelector(".code-block").innerHTML = hljs.highlight(alogDetails[algoName].code, { language: "python" }).value;
    hljs.initLineNumbersOnLoad();

    document.querySelectorAll(".animate-change").forEach((element) => element.classList.remove("animate-change"));
  };

  return (
    <div className="main-container">
      <div className="toast-sibling"></div>
      <div className="controls-div">
        <div className="algorithm-selection-div">
          <button
            className="algorithm-btn linearSearch-btn"
            onClick={() => {
              mode = LinearSearch;
              toogleMode("linearSearch");
            }}
          >
            Linear
          </button>
          <button
            className="algorithm-btn binarySearch-btn"
            onClick={() => {
              mode = BinarySearch;
              toogleMode("binarySearch");
            }}
          >
            Binary
          </button>
          <button
            className="algorithm-btn ternarySearch-btn"
            onClick={() => {
              mode = TernarySearch;
              toogleMode("ternarySearch");
            }}
          >
            Ternary
          </button>
          <button
            className="algorithm-btn jumpSearch-btn"
            onClick={() => {
              mode = JumpSearch;
              toogleMode("jumpSearch");
            }}
          >
            Jump
          </button>
          <button
            className="algorithm-btn interpolationSearch-btn"
            onClick={() => {
              mode = InterpolationSearch;
              toogleMode("interpolationSearch");
            }}
          >
            Interpolation
          </button>
          <div className="active-algo-btn">
            <div className="active-algo-btn-inner"></div>
          </div>
        </div>
        {/* TODO: Fix the slider and label based on pathfinding */}
        <div className="array-size-div">
          <label htmlFor="length" className="array-length-label">
            Array length<span className="array-length">(9)</span>
          </label>
          <input type="range" className="array-length-range range-input" name="length" id="length" min="1" max="27" step="2" defaultValue="9" onChange={() => (document.querySelector(".array-length").innerHTML = `(${document.querySelector(".array-length-range").value})`)} />
          <button className="generate-array-btn" onClick={generateArray}>
            Generate new array
          </button>
        </div>
        <div className="speed-div">
          <label htmlFor="speed" className="speed-label">
            Speed<span className="speed-value">(1x)</span>
          </label>
          <input type="range" className="speed-range range-input" name="speed" id="speed" min="0.2" max="5" step="0.2" defaultValue="1" onChange={() => (document.querySelector(".speed-value").innerHTML = `(${document.querySelector(".speed-range").value}x)`)} />
        </div>
        <div className="target-div">
          <label htmlFor="target">Target:</label>
          <input type="text" inputMode="numeric" className="text-input target-input" name="target" id="target" placeholder="Enter target" maxLength={4} />
          <button
            className="search-btn"
            onClick={async () => {
              let startTime = Date.now();
              if (document.querySelector(".target-input").value) {
                if (/^\d+$/.test(document.querySelector(".target-input").value)) {
                  await mode(arrayElements, parseInt(document.querySelector(".target-input").value), Math.floor((1000 / parseFloat(document.querySelector(".speed-range").value) / 100) * 100));
                } else {
                  showOutput("enterInt");
                }
              } else {
                showOutput("enterTarget");
              }
              document.querySelector(".time-elapsed").innerHTML = (Date.now() - startTime) / 1000;
            }}
          >
            Search!
          </button>
        </div>
        <div className="input-array-div">
          <label htmlFor="array-input">Insert array:</label>
          <input type="text" name="array-input" className="text-input array-input" placeholder="Enter integers seperated by spaces" />
          <button className="insert-array-btn" onClick={insertArray}>
            Insert array
          </button>
        </div>
      </div>
      <div className="color-key-title">Color labels:</div>
      <div className="color-key-container">
        <div className="color-key-div">
          <div className="target-key"></div>
          <span className="color-key-label">Target element</span>
        </div>
        <div className="color-key-div">
          <div className="checked-key"></div>
          <span className="color-key-label">Checked element</span>
        </div>
        <div className="color-key-div">
          <div className="found-key"></div>
          <span className="color-key-label">Found element</span>
        </div>
      </div>
      <div className="algo-parameters-div"></div>
      <div className="array-div">
        <div className="checking-element">
          <div className="element-value"></div>
          <div className="comparing-arrow">
            <div className="arrow-head"></div>
          </div>
        </div>
        <div className="low"></div>
        <div className="high"></div>
        <div className="mid-1"></div>
        <div className="mid-2"></div>
        <div className="prev"></div>
        <div className="array-elements-div"></div>
      </div>
      <div className="details-div">
        <label className="time-elapsed-label">
          Time elapsed: <span className="time-elapsed">0</span> seconds!
        </label>
        <h1 className="algo-name">Linear Search</h1>
        <div className="description-complexities-div">
          <div className="description-div">
            <h2>ABOUT THE ALGORITHM</h2>
            <div className="description-data">
              <p>
                <strong>Description:</strong> Linear search sequentially checks each element in a list until a match is found or the end of the list is reached.
              </p>
              <p>
                <strong>Searches in:</strong> Sequential data structures like arrays and lists.
              </p>
              <p>
                <strong>Advantages:</strong> Simple to implement, effective for small datasets or unsorted data.
              </p>
              <p>
                <strong>Disadvantages:</strong> Inefficient (O(n) time complexity) for large datasets.
              </p>
              <p>
                <strong>Conditions:</strong> No specific requirements; works universally but slower for large datasets.
              </p>
            </div>
          </div>
          <div className="complexities-div">
            <h2>COMPLEXITIES</h2>
            <div className="complexities-table-div">
              <table className="complexities-table">
                <tbody>
                  <tr>
                    <th className="complexities-head">Average Complexity</th>
                    <td className="complexities-data average-complexity">Θ(n)</td>
                  </tr>
                  <tr>
                    <th className="complexities-head">Best Case</th>
                    <td className="complexities-data best-complexity">Ω(1)</td>
                  </tr>
                  <tr>
                    <th className="complexities-head">Worst Case</th>
                    <td className="complexities-data worst-complexity">O(n)</td>
                  </tr>
                  <tr>
                    <th className="complexities-head">Space Complexity</th>
                    <td className="complexities-data space-complexity">O(1)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="implementation-div">
          <h2>IMPLEMENTATION</h2>
          <div className="implementation-code-div-container">
            <div className="implementation-code-div">
              <pre>
                <code className="language-python code-block">{`def linearSearch(arr: List[], target: int) -> int:
                for index in range(len(arr)):
                    if (arr[index] == target):
              return index
                return -1`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainApp;
