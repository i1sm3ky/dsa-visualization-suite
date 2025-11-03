import { useStateStore } from "../../store";
import { CellKey } from "../../types";
import { getCellRowColFromKey } from "../../utils";
import { getNeighbours, heuristic, reconstructPath, runAlgorithm } from "./utils";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";

export async function AStar() {
  const { gridDim, cellWeightMatrix, startCellKey, endCellKey, realtime, setDisableButtons } = useStateStore.getState();

  const gScore = new Map<CellKey, number>([[startCellKey!, 0]]);
  const fScore = new Map<CellKey, number>([[startCellKey!, heuristic(startCellKey!, endCellKey!)]]);
  const openSet = new MinPriorityQueue<CellKey>({
    compare: (a, b) => fScore.get(a)! - fScore.get(b)!,
  });

  const visitedSet = new Set<CellKey>();
  const parentMap = new Map<CellKey, CellKey>();

  openSet.enqueue(startCellKey!);

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue()!;
    visitedSet.add(current);

    if (current === endCellKey) break;

    const neighbours = getNeighbours(current, cellWeightMatrix, gridDim);
    for (const neighbour of neighbours) {
      const [row, col] = getCellRowColFromKey(neighbour);
      const tentative_g = gScore.get(current)! + cellWeightMatrix[row][col];

      if (tentative_g < (gScore.get(neighbour) ?? Infinity)) {
        parentMap.set(neighbour, current);
        gScore.set(neighbour, tentative_g);
        fScore.set(neighbour, tentative_g + heuristic(neighbour, endCellKey!));
        openSet.enqueue(neighbour);
      }
    }
  }

  const path = reconstructPath(startCellKey!, endCellKey!, parentMap);

  await runAlgorithm(realtime, visitedSet, path);
  setDisableButtons(false);
}
