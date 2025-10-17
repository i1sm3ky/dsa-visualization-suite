import { useStateStore } from "../../store";
import { CellKey } from "../../types";
import { getCellRowColFromKey } from "../../utils";
import { getNeighbours, reconstructPath, runAlgorithm } from "./utils";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";

type PQElement = { key: CellKey };

export async function Dijkstras() {
  const { gridDim, cellWeightMatrix, startCellKey, endCellKey, realtime, setDisableButtons } = useStateStore.getState();

  if (!startCellKey || !endCellKey) return;

  const dist = new Map<CellKey, number>();
  const parentMap = new Map<CellKey, CellKey>();
  const visitedSet = new Set<CellKey>();

  dist.set(startCellKey, 0);

  const pq = new MinPriorityQueue<PQElement>({
    compare: (a, b) => (dist.get(a.key) ?? Infinity) - (dist.get(b.key) ?? Infinity),
  });

  pq.enqueue({ key: startCellKey });

  while (!pq.isEmpty()) {
    const current = pq.dequeue()!.key;

    if (visitedSet.has(current)) continue;
    visitedSet.add(current);

    if (current === endCellKey) break;

    const neighbours = getNeighbours(current, cellWeightMatrix, gridDim);

    for (const neighbour of neighbours) {
      if (visitedSet.has(neighbour)) continue;

      const [row, col] = getCellRowColFromKey(neighbour);
      const weight = cellWeightMatrix[row][col];
      if (weight === Infinity || weight < 0) continue;

      const currentDist = dist.get(current)!;
      const alt = currentDist + weight;

      if (alt < (dist.get(neighbour) ?? Infinity)) {
        dist.set(neighbour, alt);
        parentMap.set(neighbour, current);
        pq.enqueue({ key: neighbour });
      }
    }
  }

  const path = reconstructPath(startCellKey, endCellKey, parentMap);

  await runAlgorithm(realtime, visitedSet, path);
  setDisableButtons(false);
}
