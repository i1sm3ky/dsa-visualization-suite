import { useState, useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";
import { useStateStore } from "../store";
import { Cell as TypeCell, CellKey } from "../types";
import Cell from "./Cell";
import Edge from "./Edge";
import SpaceEdge from "./SpaceEdge";

import "./Grid.css";

function Grid() {
  const { gridDim, mode, resetGrid, setCellStateMap, setCellState, isMouseDown, currentTool, draggingStart, draggingEnd, realtime, disableButtons } = useStateStore(
    useShallow((state) => ({
      gridDim: state.gridDim,
      mode: state.mode,
      resetGrid: state.resetGrid,
      setCellStateMap: state.setCellStateMap,
      setCellState: state.setCellState,
      isMouseDown: state.isMouseDown,
      currentTool: state.currentTool,
      draggingStart: state.draggingStart,
      draggingEnd: state.draggingEnd,
      realtime: state.realtime,
      disableButtons: state.disableButtons,
    }))
  );

  const sharedRefs = {
    isMouseDown: useRef(isMouseDown),
    currentTool: useRef(currentTool),
    draggingStart: useRef(draggingStart),
    draggingEnd: useRef(draggingEnd),
    realtime: useRef(realtime),
  };

  useEffect(() => {
    sharedRefs.isMouseDown.current = isMouseDown;
    sharedRefs.currentTool.current = currentTool;
    sharedRefs.draggingStart.current = draggingStart;
    sharedRefs.draggingEnd.current = draggingEnd;
    sharedRefs.realtime.current = realtime;
  }, [isMouseDown, currentTool, draggingStart, draggingEnd, realtime]);

  const [gridItems, setGridItems] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const newCellStateMap = new Map<CellKey, TypeCell>();
    const newGridItems: JSX.Element[] = [];

    const totalCols = gridDim[1] * 2 - 1;
    const totalRows = gridDim[0] * 2 - 1;

    for (let x = 0; x < totalRows; x++) {
      for (let y = 0; y < totalCols; y++) {
        const row = Math.floor(x / 2);
        const col = Math.floor(y / 2);

        const key = `g-${x}-${y}`;

        const isCell = x % 2 === 0 && y % 2 === 0;
        const isHEdge = x % 2 === 0 && y % 2 === 1;
        const isVEdge = x % 2 === 1 && y % 2 === 0;

        if (isCell) {
          const cellKey: CellKey = `${row},${col}`;
          const cell: TypeCell = {
            x: row,
            y: col,
            type: "empty",
            isVisited: 0,
            isPath: 0,
          };
          newCellStateMap.set(cellKey, cell);
          newGridItems.push(<Cell key={key} indexX={row} indexY={col} sharedRefs={sharedRefs} />);
        } else if (isHEdge && col < gridDim[1] - 1) {
          const from: CellKey = `${row},${col}`;
          const to: CellKey = `${row},${col + 1}`;
          newGridItems.push(<Edge key={key} from={from} to={to} orientation="horizontal" />);
        } else if (isVEdge && row < gridDim[0] - 1) {
          const from: CellKey = `${row},${col}`;
          const to: CellKey = `${row + 1},${col}`;
          newGridItems.push(<Edge key={key} from={from} to={to} orientation="vertical" />);
        } else {
          newGridItems.push(<SpaceEdge key={key} />);
        }
      }
    }

    setCellStateMap(newCellStateMap);

    setCellState(Math.floor(gridDim[0] / 2), 2, { type: "start" });
    setCellState(Math.floor(gridDim[0] / 2), gridDim[1] - 3, { type: "end" });

    setGridItems(newGridItems);
  }, [gridDim, resetGrid]);

  return (
    <div className={`grid ${disableButtons ? "grid-interaction-disabled" : ""} ${mode}-mode`} style={{ gridTemplateColumns: `repeat(${gridDim[1] * 2 - 1}, 1fr)` }}>
      {gridItems}
    </div>
  );
}
export default Grid;
