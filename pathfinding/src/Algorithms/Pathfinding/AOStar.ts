import { useStateStore } from "../../store";
import { CellKey } from "../../types";
import { getCellRowColFromKey } from "../../utils";
import { getNeighbours, heuristic, reconstructPath, runAlgorithm } from "./utils";

export async function AOStar() {
  const { gridDim, cellWeightMatrix, startCellKey, endCellKey, realtime, setDisableButtons } = useStateStore.getState();

  const visitedSet = new Set<CellKey>();
  const openSet = new Set<CellKey>();
  const parentMap = new Map<CellKey, CellKey>();
  const gScore = new Map<CellKey, number>();
  const fScore = new Map<CellKey, number>();

  gScore.set(startCellKey!, 0);
  fScore.set(startCellKey!, heuristic(startCellKey!, endCellKey!));
  openSet.add(startCellKey!);

  const getLowestFNode = () => {
    let bestNode: CellKey | null = null;
    let bestCost = Infinity;
    for (const node of openSet) {
      const f = fScore.get(node) ?? Infinity;
      if (f < bestCost) {
        bestCost = f;
        bestNode = node;
      }
    }
    return bestNode!;
  };

  while (openSet.size > 0) {
    const current = getLowestFNode();
    visitedSet.add(current);

    if (current === endCellKey) break;

    openSet.delete(current);

    const neighbours = getNeighbours(current, cellWeightMatrix, gridDim);
    for (const neighbour of neighbours) {
      const [row, col] = getCellRowColFromKey(neighbour);
      const weight = cellWeightMatrix[row][col] ?? 1;
      const tentativeG = (gScore.get(current) ?? Infinity) + weight;

      if (tentativeG < (gScore.get(neighbour) ?? Infinity)) {
        parentMap.set(neighbour, current);
        gScore.set(neighbour, tentativeG);

        const estimatedCost = tentativeG + heuristic(neighbour, endCellKey!);
        fScore.set(neighbour, estimatedCost);

        openSet.add(neighbour);
      }
    }

    if (parentMap.has(current)) {
      const parent = parentMap.get(current)!;
      const currentF = fScore.get(current) ?? Infinity;
      const parentG = gScore.get(parent) ?? Infinity;
      const backPropCost = parentG + (currentF - parentG);
      if (backPropCost < (fScore.get(parent) ?? Infinity)) {
        fScore.set(parent, backPropCost);
      }
    }
  }

  const path = reconstructPath(startCellKey!, endCellKey!, parentMap);

  await runAlgorithm(realtime, visitedSet, path);
  setDisableButtons(false);
}
