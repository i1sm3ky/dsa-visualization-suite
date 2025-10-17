import { useStateStore } from "../../store";
import { CellKey } from "../../types";
import { getNeighbours, reconstructPath, runAlgorithm } from "./utils";

export async function BFS() {
  const { gridDim, cellWeightMatrix, startCellKey, endCellKey, realtime, setDisableButtons } = useStateStore.getState();

  const queue: CellKey[] = [startCellKey!];
  const visitedSet = new Set<CellKey>();
  const parentMap = new Map<CellKey, CellKey>();

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current == endCellKey) break;

    visitedSet.add(current);

    const neighbours = getNeighbours(current, cellWeightMatrix, gridDim);

    for (const neighbour of neighbours) {
      if (!visitedSet.has(neighbour) && !parentMap.has(neighbour)) {
        parentMap.set(neighbour, current);
        queue.push(neighbour);
      }
    }
  }

  const path = reconstructPath(startCellKey!, endCellKey!, parentMap);

  await runAlgorithm(realtime, visitedSet, path);
  setDisableButtons(false);
}
