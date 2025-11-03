import { useStateStore } from "../../store";
import { CellKey } from "../../types";
import { getNeighbours, heuristic, reconstructPath, runAlgorithm } from "./utils";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";

export async function GreedyBestFirstSearch() {
  const { gridDim, cellWeightMatrix, startCellKey, endCellKey, realtime, setDisableButtons } = useStateStore.getState();

  const visitedSet = new Set<CellKey>();
  const parentMap = new Map<CellKey, CellKey>();
  const openSet = new MinPriorityQueue<CellKey>({
    compare: (a, b) => heuristic(a, endCellKey!) - heuristic(b, endCellKey!),
  });

  openSet.enqueue(startCellKey!);

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue()!;
    visitedSet.add(current);

    if (current === endCellKey) break;

    const neighbours = getNeighbours(current, cellWeightMatrix, gridDim);
    for (const neighbour of neighbours) {
      if (!visitedSet.has(neighbour) && !parentMap.has(neighbour)) {
        parentMap.set(neighbour, current);
        openSet.enqueue(neighbour);
      }
    }
  }

  const path = reconstructPath(startCellKey!, endCellKey!, parentMap);

  await runAlgorithm(realtime, visitedSet, path);
  setDisableButtons(false);
}
