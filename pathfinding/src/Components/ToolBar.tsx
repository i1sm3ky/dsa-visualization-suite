import React, { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useStateStore } from "../store";
import type { StateStore } from "../store";
import { CellType } from "../types";
import { debounce } from "../utils";
import Dropdown from "./Dropdown";
import { resetPathObject } from "../Algorithms/Pathfinding/utils";

import { RecursiveBacktrackingDFS } from "../Algorithms/MazeGaneration/RecursiveBacktracking(DFS)";
import { RecursiveDivisionBalanced } from "../Algorithms/MazeGaneration/RecursiveDivision(Balanced)";
import { RecursiveDivisionVertical } from "../Algorithms/MazeGaneration/RecursiveDivision(Vertical)";
import { RecursiveDivisionHorizontal } from "../Algorithms/MazeGaneration/RecursiveDivision(Horizontal)";
import { Prims } from "../Algorithms/MazeGaneration/Prims";

import { BFS } from "../Algorithms/Pathfinding/BFS";
import { DFS } from "../Algorithms/Pathfinding/DFS";
import { Dijkstras } from "../Algorithms/Pathfinding/Dijkstras";
import { AStar } from "../Algorithms/Pathfinding/AStar";
import { AOStar } from "../Algorithms/Pathfinding/AOStar";
import { GreedyBestFirstSearch } from "../Algorithms/Pathfinding/GreedyBestFirst";
import { Swarm } from "../Algorithms/Pathfinding/Swarm";
import { BidirectionalSwarm } from "../Algorithms/Pathfinding/BidirectionalSwarm";

import "./ToolBar.css";

const toolTypes: Map<CellType, string> = new Map([
  ["empty", "Erase"],
  ["start", "Start"],
  ["end", "Finish"],
  ["wall", "Wall"],
  ["water", "Water"],
  ["mud", "Mud"],
  ["sand", "Sand"],
]);

const ToolBar = React.memo(() => {
  const { mode, setMode, resetGridState, gridDim, setGridDim, setAnimationSpeed, realtime, setRealtime, startCellKey, endCellKey, resetPathAndVisited, cellWeightMatrix, currentTool, setCurrentTool, disableButtons, setDisableButtons, setCurrentAlgo, setTimeElapsed } = useStateStore(
    useShallow((state: StateStore) => ({
      mode: state.mode,
      setMode: state.setMode,
      resetGridState: state.resetGridState,
      gridDim: state.gridDim,
      setGridDim: state.setGridDim,
      setAnimationSpeed: state.setAnimationSpeed,
      realtime: state.realtime,
      setRealtime: state.setRealtime,
      startCellKey: state.startCellKey,
      endCellKey: state.endCellKey,
      resetPathAndVisited: state.resetPathAndVisited,
      cellWeightMatrix: state.cellWeightMatrix,
      currentTool: state.currentTool,
      setCurrentTool: state.setCurrentTool,
      disableButtons: state.disableButtons,
      setDisableButtons: state.setDisableButtons,
      setCurrentAlgo: state.setCurrentAlgo,
      setTimeElapsed: state.setTimeElapsed,
    }))
  );

  const modeChangeBtn = useRef<HTMLButtonElement>(null);
  const speedValSpan = useRef<HTMLSpanElement>(null);
  const realtimeCheckbox = useRef<HTMLInputElement>(null);
  const toolBtnBg = useRef<HTMLDivElement>(null);

  const [rowInput, setRowInput] = useState(gridDim[0].toString());
  const [colInput, setColInput] = useState(gridDim[1].toString());

  const [mazeGenerationAlgo, setMazeGenerationAlgo] = useState("Recursive Backtracking (DFS)");
  const [pathfindingAlgo, setPathfindingAlgo] = useState("Breadth-first Search");

  const mazeGenerationAlgoMap: Map<string, Function> = new Map([
    ["Recursive Backtracking (DFS)", RecursiveBacktrackingDFS],
    ["Recursive Division (Balanced)", RecursiveDivisionBalanced],
    ["Recursive Division (Vertical Skew)", RecursiveDivisionVertical],
    ["Recursive Division (Horizontal Skew)", RecursiveDivisionHorizontal],
    ["Prim's Algorithm", Prims],
  ]);

  const pathfindingAlgoMap: Map<string, Function> = new Map([
    ["Breadth-first Search", BFS],
    ["Depth-first Search", DFS],
    ["Dijkstra's Algorithm", Dijkstras],
    ["A* Search", AStar],
    ["AO* Search", AOStar],
    ["Greedy Best-first Search", GreedyBestFirstSearch],
    ["Swarm Algorithm", Swarm],
    ["Bidirectional Swarm Algorithm", BidirectionalSwarm],
  ]);

  const debouncedGridSizeUpdate = useCallback(
    debounce((rowsStr: string, colsStr: string) => {
      const rows = Math.max(parseInt(rowsStr || "5", 10), 5);
      const cols = Math.max(parseInt(colsStr || "10", 10), 10);

      setRowInput(rows.toString());
      setColInput(cols.toString());

      if (rows !== gridDim[0] || cols !== gridDim[1]) {
        setGridDim([rows, cols]);
      }
    }, 500),
    [gridDim, setGridDim]
  );

  useEffect(() => {
    debouncedGridSizeUpdate(rowInput, colInput);
  }, [rowInput, colInput, debouncedGridSizeUpdate]);

  useEffect(() => {
    if (realtime) {
      resetPathAndVisited();
      pathfindingAlgoMap.get(pathfindingAlgo)!();
    }
  }, [startCellKey, endCellKey, cellWeightMatrix]);

  function handleModeChange() {
    modeChangeBtn.current?.classList.toggle("animate-mode-change-btn");
    setTimeout(() => modeChangeBtn.current?.classList.toggle("animate-mode-change-btn"), 500);
    setMode(mode === "grid" ? "graph" : "grid");
  }

  const debouncedSpeedUpdate = debounce((curVal) => {
    setAnimationSpeed(Math.floor(20 / parseFloat(curVal)));
  }, 300);

  return (
    <div className="toolbar">
      <span className="tool-label-span">
        <label htmlFor="mode-change-btn">Mode:</label>
        <button className="toolbar-btn mode-change-btn" id="mode-change-btn" onClick={handleModeChange} disabled={disableButtons}>
          <span ref={modeChangeBtn}>G{mode.slice(1)}</span>
        </button>
      </span>
      <span className="tool-label-span">
        <label htmlFor="row-num-input">Rows:</label>
        <div className={`grid-dim-input ${disableButtons ? "grid-dim-input-disabled" : ""}`}>
          <button className="grid-dim-change-btn" onClick={() => setRowInput((prev) => (parseInt(prev) - 1).toString())} disabled={disableButtons}>
            -
          </button>
          <input className="grid-dim-text-input" id="row-num-input" type="text" placeholder="Rows" value={rowInput} onChange={(e) => setRowInput(e.target.value)} disabled={disableButtons} />
          <button className="grid-dim-change-btn" onClick={() => setRowInput((prev) => (parseInt(prev) + 1).toString())} disabled={disableButtons}>
            +
          </button>
        </div>
      </span>
      <span className="tool-label-span">
        <label htmlFor="col-num-input">Cols:</label>
        <div className={`grid-dim-input ${disableButtons ? "grid-dim-input-disabled" : ""}`}>
          <button className="grid-dim-change-btn" onClick={() => setColInput((prev) => (parseInt(prev) - 1).toString())} disabled={disableButtons}>
            -
          </button>
          <input className="grid-dim-text-input" id="col-num-input" type="text" placeholder="Cols" value={colInput} onChange={(e) => setColInput(e.target.value)} disabled={disableButtons} />
          <button className="grid-dim-change-btn" onClick={() => setColInput((prev) => (parseInt(prev) + 1).toString())} disabled={disableButtons}>
            +
          </button>
        </div>
      </span>
      <button className="toolbar-btn" onClick={resetGridState} disabled={disableButtons}>
        Reset Grid
      </button>
      <span className="tool-label-span">
        <label htmlFor="speed" className="speed-label">
          Speed (<span ref={speedValSpan}>1.0</span>x):
        </label>
        <input
          type="range"
          className="speed-range"
          name="speed"
          id="speed"
          min="0.2"
          max="5"
          step="0.2"
          defaultValue="1"
          onChange={(e) => {
            const curVal = parseFloat(e.target.value).toFixed(1);
            speedValSpan.current!.innerHTML = curVal;
            debouncedSpeedUpdate(curVal);
          }}
          disabled={disableButtons}
        />
      </span>
      <div
        className={`realtime-checkbox ${disableButtons ? "realtime-checkbox-disabled" : ""}`}
        onClick={() => {
          realtimeCheckbox.current!.checked = !realtimeCheckbox.current!.checked;
          resetPathObject(startCellKey!);
          setRealtime(realtimeCheckbox.current!.checked);
        }}
      >
        <input ref={realtimeCheckbox} type="checkbox" id="realtimeCheckbox" disabled={disableButtons} />
        <label htmlFor="realtimeCheckbox">
          <span></span>
          Realtime
        </label>
      </div>
      <span className="tool-label-span">
        <label htmlFor="maze generation algorithm">Maze Generation:</label>
        <Dropdown selectedOption={mazeGenerationAlgo} disabled={disableButtons}>
          {[...mazeGenerationAlgoMap.keys()].map((algoName, index) => (
            <a
              onClick={() => {
                setMazeGenerationAlgo(algoName);
                setCurrentAlgo(algoName);
              }}
              key={index}
            >
              {algoName}
            </a>
          ))}
        </Dropdown>
        <button
          className="toolbar-btn"
          onClick={async () => {
            setDisableButtons(true);
            resetGridState();
            const startTime = Date.now();
            await mazeGenerationAlgoMap.get(mazeGenerationAlgo)!();
            setTimeElapsed((Date.now() - startTime) / 1000);
          }}
          disabled={disableButtons}
        >
          Generate
        </button>
      </span>
      <span className="tool-label-span">
        <label htmlFor="pathfinding algorithm">Algorithm:</label>
        <Dropdown selectedOption={pathfindingAlgo} disabled={disableButtons}>
          {[...pathfindingAlgoMap.keys()].map((algoName, index) => (
            <a
              onClick={() => {
                setPathfindingAlgo(algoName);
                setCurrentAlgo(algoName);
              }}
              key={index}
            >
              {algoName}
            </a>
          ))}
        </Dropdown>
        <button
          className="toolbar-btn"
          onClick={async () => {
            resetPathAndVisited();
            setDisableButtons(true);
            resetPathObject(startCellKey!);
            const startTime = Date.now();
            await pathfindingAlgoMap.get(pathfindingAlgo)!();
            setTimeElapsed((Date.now() - startTime) / 1000);
          }}
          disabled={disableButtons}
        >
          Visualize
        </button>
      </span>
      <span className="tool-label-span">
        <label htmlFor="obstacles">Obstacles:</label>
        <div>
          <div className={`tool-btn-bg tool-${currentTool}`} ref={toolBtnBg}></div>
          {[...toolTypes.keys()].map((tool, index) => (
            <button
              key={tool}
              className="tool-btn"
              onClick={() => {
                setCurrentTool(tool);
                toolBtnBg.current?.style.setProperty("--tool-btn-bg-offset", `${index}`);
              }}
              disabled={disableButtons}
            >
              {toolTypes.get(tool)}
            </button>
          ))}
        </div>
      </span>
      <button
        className="toolbar-btn"
        onClick={() => {
          resetPathAndVisited();
        }}
        disabled={disableButtons}
      >
        Clear Path & Visited
      </button>
    </div>
  );
});

export default ToolBar;
