import { useStateStore } from "../../store";
import { CellKey } from "../../types";
import { getNeighbours, reconstructPath, runAlgorithm } from "./utils";

export async function DFS() {
  const { gridDim, cellWeightMatrix, startCellKey, endCellKey, realtime, setDisableButtons } = useStateStore.getState();

  const stack: CellKey[] = [startCellKey!];
  const visitedSet = new Set<CellKey>();
  const parentMap = new Map<CellKey, CellKey>();

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (current === endCellKey) break;

    visitedSet.add(current);

    const neighbours = getNeighbours(current, cellWeightMatrix, gridDim);
    for (const neighbour of neighbours) {
      if (!visitedSet.has(neighbour)) {
        parentMap.set(neighbour, current);
        stack.push(neighbour);
      }
    }
  }

  const path = reconstructPath(startCellKey!, endCellKey!, parentMap);

  await runAlgorithm(realtime, visitedSet, path);
  setDisableButtons(false);
}
