declare const hljs: any;

import { useEffect } from "react";
import { useStateStore } from "../store";
import { algoDetails } from "./AlgoDetailsJSON";

import "./AlgoDetails.css";

function AlgoDetails() {
  const currentAlgo = useStateStore((state) => state.currentAlgo);
  const timeElapsed = useStateStore((state) => state.timeElapsed);
  const algo: {
    title: string;
    description: string[];
    complexities: {
      average: string;
      best: string;
      worst: string;
      space: string;
    };
    code: string;
  } = algoDetails[currentAlgo as keyof typeof algoDetails];

  useEffect(() => {
    document.querySelectorAll(".animate-data-change").forEach((element) => {
      element.classList.toggle("animate-data-change");
      setTimeout(() => element.classList.toggle("animate-data-change"), 1);
    });

    document.querySelector(".code-block")!.innerHTML = hljs.highlight(algo.code, { language: "python" }).value;
    hljs.initLineNumbersOnLoad();
  }, [currentAlgo]);

  return (
    <div className="details-div">
      <label className="time-elapsed-label">
        Time elapsed: <span className="time-elapsed">{timeElapsed}</span> seconds!
      </label>
      <h1 className="algo-name">{algo.title}</h1>
      <div className="description-complexities-div">
        <div className="description-div">
          <h2>ABOUT THE ALGORITHM</h2>
          <div className="description-data">
            <p>
              <strong>Description:</strong> <span className="animate-data-change">{algo.description[0]}</span>
            </p>
            <p>
              <strong>Operates on:</strong> <span className="animate-data-change">{algo.description[1]}</span>
            </p>
            <p>
              <strong>Advantages:</strong> <span className="animate-data-change">{algo.description[2]}</span>
            </p>
            <p>
              <strong>Disadvantages:</strong> <span className="animate-data-change">{algo.description[3]}</span>
            </p>
            <p>
              <strong>Conditions:</strong> <span className="animate-data-change">{algo.description[4]}</span>
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
                  <td className="complexities-data average-complexity animate-data-change">Θ({algo.complexities.average})</td>
                </tr>
                <tr>
                  <th className="complexities-head">Best Case</th>
                  <td className="complexities-data best-complexity animate-data-change">Ω({algo.complexities.best})</td>
                </tr>
                <tr>
                  <th className="complexities-head">Worst Case</th>
                  <td className="complexities-data worst-complexity animate-data-change">O({algo.complexities.worst})</td>
                </tr>
                <tr>
                  <th className="complexities-head">Space Complexity</th>
                  <td className="complexities-data space-complexity animate-data-change">O({algo.complexities.space})</td>
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
              <code className="language-python code-block animate-data-change">{algo.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AlgoDetails;
