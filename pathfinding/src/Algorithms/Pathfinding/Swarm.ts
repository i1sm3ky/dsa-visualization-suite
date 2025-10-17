import { useStateStore } from "../../store";
import { CellKey } from "../../types";
import { getNeighbours, reconstructPath, runAlgorithm } from "./utils";

export async function Swarm() {
  const { gridDim, cellWeightMatrix, startCellKey, endCellKey, realtime, setDisableButtons } = useStateStore.getState();

  const queue: CellKey[] = [startCellKey!];
  const visitedSet = new Set<CellKey>([startCellKey!]);
  const parentMap = new Map<CellKey, CellKey>();

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current === endCellKey) break;

    const neighbours = getNeighbours(current, cellWeightMatrix, gridDim);
    for (const neighbour of neighbours) {
      if (!visitedSet.has(neighbour)) {
        visitedSet.add(neighbour);
        parentMap.set(neighbour, current);
        queue.push(neighbour);
      }
    }
  }

  const path = reconstructPath(startCellKey!, endCellKey!, parentMap);

  await runAlgorithm(realtime, visitedSet, path);
  setDisableButtons(false);
}
