import ReactDOM from "react-dom/client";
import { useEffect } from "react";

import ArrayElement from "./ArrayElement.jsx";

import { BubbleSort } from "./algorithms/BubbleSort.js";
import { SelectionSort } from "./algorithms/SelectionSort.js";
import { InsertionSort } from "./algorithms/InsertionSort.js";
import { MergeSort } from "./algorithms/MergeSort.js";
import { QuickSort } from "./algorithms/QuickSort.js";
import { HeapSort } from "./algorithms/HeapSort.js";

import { alogDetails } from "./AlgoDetails.js";
import { swapElements, showOutput } from "./HelperFunctions.js";

import "./MainApp.css";

var arrayElementsRoot = "";
var mode = true;
var arrayChanged = false;

var runAlgorithm = BubbleSort;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleArray = async (array, arrayElements, animate = false, speed = 0) => {
  toggleInputs(false);
  for (let index1 = array.length - 1; index1 > 0; index1--) {
    let index2 = Math.floor(Math.random() * (index1 + 1));

    [array[index1], array[index2]] = [array[index2], array[index1]];
    [arrayElements[index1], arrayElements[index2]] = [arrayElements[index2], arrayElements[index1]];

    if (animate && index1 != index2) {
      await swapElements(index1, index2, mode, speed);
      arrayChanged = true;
    }
  }
  toggleInputs(true);
};

function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    (s = h.s), (v = h.v), (h = h.h);
  }

  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return {
    r: Math.round((r + 0.35) * 255),
    g: Math.round((g + 0.35) * 255),
    b: Math.round((b + 0.35) * 255),
  };
}

const getColor = (num) => {
  var rgb = HSVtoRGB(0.3 + (num / 100.0) * 0.25, 1.0, 1.0);
  return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
};

const mutateArray = async (array, mutateMode = "") => {
  if (arrayElementsRoot === "") arrayElementsRoot = ReactDOM.createRoot(document.querySelector(".array-elements-div"));

  let oldArray = [...array];

  if (mutateMode === "add") {
    let inputLength = document.querySelector(".array-length-range").value;
    while (array.length < inputLength) {
      let randInt = random(1, 50);
      array.push(randInt);
    }
  }

  if (mutateMode === "remove") {
    let inputLength = document.querySelector(".array-length-range").value;
    let removeCount = 0;
    while (array.length > inputLength) {
      array.pop();
      document.querySelector(`.array-element-${array.length} > .array-element`).classList.add(`${mode ? "grey-out-block" : "grey-out-bar"}`);
      document.querySelector(`.array-element-${array.length} > .element-value`).classList.add(`${mode ? "grey-out-block" : "grey-out-bar"}`);
      removeCount++;
    }
    await sleep(removeCount * 100 + 1100);
  }

  let sortedArray = [];
  let indexedArray = [];

  array.sort((a, b) => a - b);
  array.forEach((value, index) => sortedArray.push([value, getColor((index * 100) / array.length)]));
  // if (mutateMode === "add" || mutateMode === "remove") {
  oldArray.forEach((element) => {
    for (let index = 0; index < sortedArray.length; index++) {
      if (sortedArray[index][0] === element) {
        indexedArray.push(sortedArray[index]);
        sortedArray.splice(index, 1);
      }
    }
  });
  // }
  if (mutateMode != "noShuffle") shuffleArray(sortedArray);
  sortedArray.forEach((element) => indexedArray.push(element));

  array = [];
  indexedArray.forEach((element) => array.push(element[0]));

  let arrayMin = Math.min(...array);
  let arrayMax = Math.max(...array);
  let arrayElements = indexedArray.map((item, index) => <ArrayElement key={index} index={index} value={item[0]} color={item[1]} mode={mode} height={((item[0] - arrayMin) * (50 - 5)) / (arrayMax - arrayMin) + 5} />);
  arrayElementsRoot.render(arrayElements);

  setTimeout(() => {
    if (document.querySelectorAll(`${mode ? ".array-element-reveal-block" : ".array-element-reveal-bar"}`)) {
      document.querySelectorAll(`${mode ? ".array-element-reveal-block" : ".array-element-reveal-bar"}`).forEach((element) => {
        element.classList.remove(`${mode ? "array-element-reveal-block" : "array-element-reveal-bar"}`);
        element.style.opacity = 1;
        if (!element.classList.contains("element-value")) element.style.transform = "translateY(25px)";
        if (element.classList.contains("element-value")) element.classList.add(`${mode ? "element-value-block" : "element-value-bar"}`);
      });
    }
  }, array.length * 100 + 1000);

  return Promise.resolve([array, arrayElements]);
};

const toggleInputs = (enable) => {
  const inps = [...document.querySelectorAll(".controls-div button"), ...document.querySelectorAll(".controls-div input")];

  inps.forEach((inp) => {
    inp.disabled = !enable;
  });
};

const MainApp = () => {
  let array = [];
  let arrayElements = [];
  let prevLength = 9;
  let orderBy = true;
  let inputArray = "";

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

    window.onclick = (event) => {
      if (!(event.target.matches(".algorithm-selection-dropdown-btn") || event.target.matches(".selected-algo-div") || event.target.matches(".algorithm-selection-dropdown-icon"))) {
        document.querySelector(".algorithm-selection-dropdown-content").childNodes.forEach((element, index) => (element.style.transform = `translateY(-${index * 100}%)`));
        document.querySelector(".algorithm-selection-dropdown-content").style.height = "0";
        setTimeout(() => document.querySelector(".algorithm-selection-dropdown-content").childNodes.forEach((element) => (element.style.opacity = "0")), 300);
        setTimeout(() => document.querySelector(".algorithm-selection-dropdown-content").childNodes.forEach((element) => (element.style.display = "none")), 600);
      }
    };
    document.querySelector(".algorithm-selection-dropdown-content").childNodes.forEach((element, index) => (element.style.transform = `translateY(-${index * 100}%)`));

    generateArray(false);

    hljs.highlightAll();
    hljs.initLineNumbersOnLoad();

    document.addEventListener("keydown", (event) => {
      if (event.code === "Enter" && event.target.classList.contains("target-input")) document.querySelector(".search-btn").click();
      if (event.code === "Enter" && event.target.classList.contains("array-input")) document.querySelector(".insert-array-btn").click();
    });

    setTimeout(() => {
      document.querySelector(".order-btn-bar:nth-child(1)").style.transform = "translateX(0em)";
      document.querySelector(".order-btn-bar:nth-child(2)").style.transform = "translateX(0.75em)";
      document.querySelector(".order-btn-bar:nth-child(3)").style.transform = "translateX(1.5em)";
    }, 100);
  }, []);

  const generateArray = async (isModeInversed) => {
    toggleInputs(false);
    let index = 0;
    for (; index < array.length; index++) {
      if (mode) {
        document.querySelector(`.array-element-${index} > .array-element`).classList.add("grey-out-block");
        document.querySelector(`.array-element-${index} > .element-value`).classList.add("grey-out-block");
      } else document.querySelector(`.array-element-${index} > .array-element`).classList.add("grey-out-bar");
      await sleep(100);
    }
    await sleep(index * 100 + 1000);
    if (!isModeInversed) {
      array = [];
      let inputLength = document.querySelector(".array-length-range").value;
      while (array.length < inputLength) {
        let randInt = random(1, 50);
        array.push(randInt);
      }
    }
    mutateArray([]);
    await sleep(1000);
    [array, arrayElements] = await mutateArray(array).then((result) => {
      return result;
    });
    setTimeout(() => toggleInputs(true), index * 100 + 1000);

    arrayChanged = false;
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
    toggleInputs(false);
    const validArray = /^(?:\d+)(?: \d+)*$/g;
    if (document.querySelector(".array-input").value == "") showOutput("enterArrayElements");
    if (document.querySelector(".array-input").value != inputArray) {
      if (validArray.test(document.querySelector(".array-input").value)) {
        let index = 0;
        for (; index < array.length; index++) {
          if (mode) {
            document.querySelector(`.array-element-${index} > .array-element`).classList.add("grey-out-block");
            document.querySelector(`.array-element-${index} > .element-value`).classList.add("grey-out-block");
          } else document.querySelector(`.array-element-${index} > .array-element`).classList.add("grey-out-bar");
          await sleep(100);
        }
        await sleep(index * 100 + 1000);
        inputArray = document.querySelector(".array-input").value;
        array = inputArray.split(" ").map(Number);
        mutateArray([]);
        await sleep(1000);
        [array, arrayElements] = await mutateArray(array, "noShuffle").then((result) => {
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
    setTimeout(() => toggleInputs(true), array.length * 100 + 1000);
    showOutput("info", 0, "Array inserted!");
  };

  const toggleMode = async () => {
    toggleInputs(false);
    document.querySelector(".mode-btn-div").classList.add("mode-order-btn-active");
    setTimeout(() => document.querySelector(".mode-btn-div").classList.remove("mode-order-btn-active"), 300);

    let element1 = document.querySelector(".mode-btn-element:nth-child(1)");
    let element2 = document.querySelector(".mode-btn-element:nth-child(2)");
    let element3 = document.querySelector(".mode-btn-element:nth-child(3)");

    if (mode) {
      element1.style.height = "0.5em";
      element2.style.height = "0.5em";
      element3.style.height = "0.5em";

      element1.style.width = "0.5em";
      element2.style.width = "0.5em";
      element3.style.width = "0.5em";

      element1.style.transform = "translateX(0em)";
      element2.style.transform = "translateX(0.75em)";
      element3.style.transform = "translateX(1.5em)";

      await sleep(300);

      element2.style.height = "1em";
      element3.style.height = "1.5em";
    } else {
      element2.style.height = "0.5em";
      element3.style.height = "0.5em";

      element2.style.transform = "translateX(0.75em) translateY(-0.95em)";

      await sleep(300);

      element1.style.height = "0.75em";
      element2.style.height = "0.75em";
      element3.style.height = "0.75em";

      element1.style.width = "0.75em";
      element2.style.width = "0.75em";
      element3.style.width = "0.75em";

      element1.style.transform = "translateX(0.375em)";
      element3.style.transform = "translateX(1.125em)";

      await sleep(300);

      element2.style.transform = "translateX(0.75em) translateY(-0.75em)";
    }

    mode = !mode;
    if (arrayChanged) {
      await generateArray(true);
    }
    document.querySelector(".array-elements-div").classList.remove(`${mode ? "array-elements-div-bars" : "array-elements-div-blocks"}`);
    document.querySelector(".array-elements-div").classList.add(`${mode ? "array-elements-div-blocks" : "array-elements-div-bars"}`);

    arrayElements.forEach((element, index) => {
      document.querySelector(`.array-element-${element.props.index} > .array-element`).classList.remove(`${mode ? "array-element-bar" : "array-element-block"}`);
      document.querySelector(`.array-element-${element.props.index} > .array-element`).classList.add(`${mode ? "array-element-block" : "array-element-bar"}`);
      document.querySelector(`.array-element-${element.props.index} > .array-element`).style.height = mode ? "4em" : `${element.props.height}vh`;
      document.querySelector(`.array-element-${element.props.index} > .array-element`).style.setProperty("--array-element-height", mode ? "4em" : `${element.props.height}vh`);
      if (mode) {
        document.querySelector(`.array-element-${element.props.index} > .element-value`).classList.add("array-element-reveal-block");
        setTimeout(() => document.querySelector(`.array-element-${element.props.index} > .element-value`).classList.remove("array-element-reveal-block"), 100 * index + 1000);
        document.querySelector(`.array-element-${element.props.index}`).classList.remove("array-element-bar");
        document.querySelector(`.array-element-${element.props.index} > .element-value`).classList.remove("element-value-bar");
        document.querySelector(`.array-element-${element.props.index} > .element-value`).classList.add("element-value-block");
        setTimeout(() => (document.querySelector(`.array-element-${element.props.index} > .element-value`).style.opacity = 1), 200);
      } else {
        document.querySelector(`.array-element-${element.props.index}`).classList.add("array-element-bar");
        document.querySelector(`.array-element-${element.props.index} > .element-value`).classList.remove("element-value-block");
        document.querySelector(`.array-element-${element.props.index} > .element-value`).classList.add("element-value-bar");
        document.querySelector(`.array-element-${element.props.index} > .element-value`).style.opacity = 0;
      }
    });
    toggleInputs(true);
  };

  const toggleAlgo = async (algoName) => {
    while (document.querySelector(".selected-algo-div").innerHTML != "") {
      document.querySelector(".selected-algo-div").innerHTML = document.querySelector(".selected-algo-div").innerHTML.slice(0, -1);
      await sleep(50);
    }
    let index = 0;
    while (document.querySelector(".selected-algo-div").innerHTML != alogDetails[algoName].title) {
      document.querySelector(".selected-algo-div").innerHTML += alogDetails[algoName].title[index++];
      await sleep(50);
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
    <div>
      <div className="toast-sibling"></div>
      <div className="controls-div">
        <div className="mode-algorithm-selection-div">
          <div className="mode-selection-div">
            <label htmlFor="mode">Mode:</label>
            <a onClick={toggleMode}>
              <div className="mode-btn-div">
                <div className="mode-btn-element"></div>
                <div className="mode-btn-element"></div>
                <div className="mode-btn-element"></div>
              </div>
            </a>
          </div>
          <div>
            <button
              className="algorithm-selection-dropdown-btn"
              onClick={() => {
                document.querySelector(".algorithm-selection-dropdown-content").childNodes.forEach((element) => (element.style.display = "block"));
                document.querySelector(".algorithm-selection-dropdown-btn > svg").style.transform = "translateY(2px)";
                setTimeout(() => {
                  document.querySelector(".algorithm-selection-dropdown-btn > svg").style.transform = "translateY(0)";
                  document.querySelector(".algorithm-selection-dropdown-content").childNodes.forEach((element) => (element.style.opacity = "1"));
                  document.querySelector(".algorithm-selection-dropdown-content").childNodes.forEach((element) => (element.style.transform = "translateY(0)"));
                  document.querySelector(".algorithm-selection-dropdown-content").style.height = "calc(calc(2em + 10px) * 6)";
                }, 300);
              }}
            >
              <div className="selected-algo-div">Bubble Sort</div>
              <svg className="algorithm-selection-dropdown-icon" xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" viewBox="0 0 320 512" fill="currentcolor">
                <path className="algorithm-selection-dropdown-icon" d="m31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1l-128.6 128.7c-7.8 7.8-20.5 7.8-28.3 0l-128.6-128.7c-12.6-12.6-3.7-34.1 14.1-34.1z" />
              </svg>
            </button>
            <div className="algorithm-selection-dropdown-content">
              <a
                onClick={() => {
                  toggleAlgo("bubbleSort");
                  runAlgorithm = BubbleSort;
                }}
              >
                Bubble Sort
                <br />
              </a>
              <a
                onClick={() => {
                  toggleAlgo("selectionSort");
                  runAlgorithm = SelectionSort;
                }}
              >
                Selection Sort
                <br />
              </a>
              <a
                onClick={() => {
                  toggleAlgo("insertionSort");
                  runAlgorithm = InsertionSort;
                }}
              >
                Insertion Sort
                <br />
              </a>
              <a
                onClick={() => {
                  toggleAlgo("mergeSort");
                  runAlgorithm = MergeSort;
                }}
              >
                Merge Sort
                <br />
              </a>
              <a
                onClick={() => {
                  toggleAlgo("quickSort");
                  runAlgorithm = QuickSort;
                }}
              >
                Quick Sort
                <br />
              </a>
              <a
                onClick={() => {
                  toggleAlgo("heapSort");
                  runAlgorithm = HeapSort;
                }}
              >
                Heap Sort
                <br />
              </a>
            </div>
          </div>
        </div>
        <div className="array-size-div">
          <label htmlFor="length" className="array-length-label">
            Array length<span className="array-length">(9)</span>
          </label>
          <input type="range" className="array-length-range range-input" name="length" id="length" min="1" max="27" step="2" defaultValue="9" onChange={() => (document.querySelector(".array-length").innerHTML = `(${document.querySelector(".array-length-range").value})`)} />
          <button className="generate-array-btn" onClick={() => generateArray(false)}>
            Generate new array
          </button>
        </div>
        <div className="speed-div">
          <label htmlFor="speed" className="speed-label">
            Speed<span className="speed-value">(1x)</span>
          </label>
          <input type="range" className="speed-range range-input" name="speed" id="speed" min="0.2" max="3" step="0.2" defaultValue="1" onChange={() => (document.querySelector(".speed-value").innerHTML = `(${document.querySelector(".speed-range").value}x)`)} />
          <button className="shuffle-array-btn" onClick={async () => await shuffleArray(array, arrayElements, true, Math.floor((1000 / parseFloat(document.querySelector(".speed-range").value) / 100) * 100))}>
            Shuffle array
          </button>
        </div>
        <div className="order-sort-div">
          <div className="order-selection-div">
            <label htmlFor="order">Order:</label>
            <a
              onClick={() => {
                document.querySelector(".order-btn-div").classList.add("mode-order-btn-active");
                setTimeout(() => document.querySelector(".order-btn-div").classList.remove("mode-order-btn-active"), 300);
                if (orderBy) {
                  document.querySelector(".order-btn-bar:nth-child(1)").style.transform = "translateX(1.5em)";
                  document.querySelector(".order-btn-bar:nth-child(3)").style.transform = "translateX(0em)";
                } else {
                  document.querySelector(".order-btn-bar:nth-child(1)").style.transform = "translateX(0em)";
                  document.querySelector(".order-btn-bar:nth-child(3)").style.transform = "translateX(1.5em)";
                }
                orderBy = !orderBy;
              }}
            >
              <div className="order-btn-div">
                <div className="order-btn-bar"></div>
                <div className="order-btn-bar"></div>
                <div className="order-btn-bar"></div>
              </div>
            </a>
          </div>
          <button
            className="sort-btn"
            onClick={async () => {
              const startTime = Date.now();
              // console.log(Math.floor((250 / parseFloat(document.querySelector(".speed-range").value) / 100) * 100));
              arrayElements = await runAlgorithm(arrayElements, orderBy ? "asc" : "desc", mode, Math.floor((500 / parseFloat(document.querySelector(".speed-range").value) / 100) * 100));
              // console.log(arrayElements);
              arrayChanged = true;
              const timeTaken = (Date.now() - startTime) / 1000;
              showOutput("sorted", Math.floor(timeTaken));
              document.querySelector(".time-elapsed").innerHTML = timeTaken;
            }}
          >
            Sort!
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
      {/* <div className="color-key-title">Color labels:</div> */}
      <div className="color-key-container"></div>
      <div className="algo-parameters-div"></div>
      <div className="array-div">
        <div className="array-elements-div array-elements-div-blocks"></div>
      </div>
      <div className="details-div">
        <label className="time-elapsed-label">
          Time elapsed: <span className="time-elapsed">0</span> seconds!
        </label>
        <h1 className="algo-name">Bubble Sort</h1>
        <div className="description-complexities-div">
          <div className="description-div">
            <h2>ABOUT THE ALGORITHM</h2>
            <div className="description-data">
              <p>
                <strong>Description:</strong> Linear search sequentially checks each element in a list until a match is found or the end of the list is reached.
              </p>
              <p>
                <strong>Advantages:</strong> Simple to understand and implement.
              </p>
              <p>
                <strong>Stability:</strong> Yes, Adjacent elements are swapped only when needed, preserving order.
              </p>
              <p>
                <strong>Disadvantages:</strong> Very inefficient for large datasets.
              </p>
              <p>
                <strong>Conditions:</strong> Best suited for small datasets or nearly sorted data.
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
                    <td className="complexities-data average-complexity">
                      Θ(n<sup>2</sup>)
                    </td>
                  </tr>
                  <tr>
                    <th className="complexities-head">Best Case</th>
                    <td className="complexities-data best-complexity">Ω(n)</td>
                  </tr>
                  <tr>
                    <th className="complexities-head">Worst Case</th>
                    <td className="complexities-data worst-complexity">
                      O(n<sup>2</sup>)
                    </td>
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
                <code className="language-python code-block">{`def bubbleSort(arr: List[int]) -> None:
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainApp;
