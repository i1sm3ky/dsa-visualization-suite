import React, { useCallback, useMemo } from "react";
import { useStateStore } from "../store";
import { CellKey, CellType } from "../types";

import "./Cell.css";
import { useShallow } from "zustand/shallow";

const selectCellByKey = (key: CellKey) => (state: any) => state.cellStateMap.get(key);

interface Props {
  indexX: number;
  indexY: number;
  sharedRefs: {
    isMouseDown: React.MutableRefObject<boolean>;
    currentTool: React.MutableRefObject<CellType>;
    draggingStart: React.MutableRefObject<boolean>;
    draggingEnd: React.MutableRefObject<boolean>;
    realtime: React.MutableRefObject<boolean>;
  };
}

const Cell = React.memo(({ indexX, indexY, sharedRefs }: Props) => {
  const key: CellKey = useMemo(() => `${indexX},${indexY}` as CellKey, [indexX, indexY]);
  const cell = useStateStore(selectCellByKey(key));

  const { isMouseDown, currentTool, draggingStart, draggingEnd, realtime } = sharedRefs;

  const { setMouseDown, setDraggingStart, setDraggingEnd, setCellState } = useStateStore(
    useShallow((state) => ({
      setMouseDown: state.setMouseDown,
      setDraggingStart: state.setDraggingStart,
      setDraggingEnd: state.setDraggingEnd,
      setCellState: state.setCellState,
    }))
  );

  const handleCellStateChange = useCallback(() => {
    if (cell.type === "start") {
      setDraggingStart(true);
      return;
    } else if (cell.type === "end") {
      setDraggingEnd(true);
      return;
    }

    if (draggingStart.current) {
      setCellState(indexX, indexY, { type: "start" });
    } else if (draggingEnd.current) {
      setCellState(indexX, indexY, { type: "end" });
    } else {
      const type: CellType = cell.type === currentTool.current ? "empty" : currentTool.current;
      setCellState(indexX, indexY, { type });
    }
  }, [cell, draggingStart.current, draggingEnd.current, currentTool.current, indexX, indexY, setCellState, setDraggingStart, setDraggingEnd]);

  if (!cell) return null;

  const cellClass = `cell cell-${indexX}-${indexY} cell-${cell.type} ${cell.isVisited ? (realtime.current ? "cell-visited" : "cell-visiting") : ""} ${cell.isPath ? "cell-path" : ""}`;

  return (
    <div className="cell-parent">
      <div
        className={cellClass}
        onMouseDown={(e) => {
          e.preventDefault();
          setMouseDown(true);
          handleCellStateChange();
        }}
        onMouseEnter={() => {
          if (isMouseDown.current) {
            handleCellStateChange();
          }
        }}
        onMouseUp={() => {
          setMouseDown(false);
          setDraggingStart(false);
          setDraggingEnd(false);
        }}
      ></div>
    </div>
  );
});

export default Cell;
