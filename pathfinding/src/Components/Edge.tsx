import React, { useMemo } from "react";
import { useStateStore } from "../store";
import { Cell, CellKey } from "../types";

import "./Edge.css";
import { useShallow } from "zustand/shallow";

function computeEdgeRenderData(orientation: "horizontal" | "vertical", fromCell: Cell, toCell: Cell) {
  let length = "100%";
  let shift = "";
  let traverse = "";
  let traverseStyle = "";

  if (fromCell.type === "wall" && toCell.type === "wall") {
    length = "0%";
  } else if (fromCell.type === "wall" || toCell.type === "wall") {
    length = "50%";
    if (fromCell.type === "wall") {
      shift = orientation === "horizontal" ? "shift-edge-right" : "shift-edge-down";
    }
  }

  if ((fromCell.isVisited || fromCell.type === "start") && (fromCell.isVisited < toCell.isVisited || toCell.type === "end")) {
    traverse = "left-to-right";
  } else if ((toCell.isVisited || toCell.type === "start") && (fromCell.isVisited > toCell.isVisited || fromCell.type === "end")) {
    traverse = "right-to-left";
  }

  if ((fromCell.isVisited || fromCell.type === "start" || fromCell.type === "end") && (toCell.isVisited || toCell.type === "start" || toCell.type === "end")) {
    traverseStyle = "visit";
  }
  if ((fromCell.isPath || fromCell.type === "start" || fromCell.type === "end") && (toCell.isPath || toCell.type === "start" || toCell.type === "end")) {
    traverseStyle = "path";
  }

  return { length, shift, traverse, traverseStyle };
}

const Edge = React.memo(({ from, to, orientation }: { from: CellKey; to: CellKey; orientation: "horizontal" | "vertical" }) => {
  const { fromCell, toCell } = useStateStore(
    useShallow((state) => {
      return {
        fromCell: state.cellStateMap.get(from),
        toCell: state.cellStateMap.get(to),
      };
    })
  );

  const { length, shift, traverse, traverseStyle } = useMemo(() => {
    return computeEdgeRenderData(orientation, fromCell!, toCell!);
  }, [fromCell, toCell]);

  return (
    <div className={`edge edge-${orientation}`}>
      <div className={`edge-line edge-traverse-${traverse} edge-traverse-style-${traverseStyle} ${shift}`} style={{ "--length": length } as React.CSSProperties}></div>
    </div>
  );
});

export default Edge;
