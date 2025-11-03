import { useStateStore } from "../../store";
import { CellKey } from "../../types";
import { getNeighbours, reconstructPath, runAlgorithm } from "./utils";

function interleaveSets(set1: Set<CellKey>, set2: Set<CellKey>): Set<CellKey> {
  const arr1 = Array.from(set1);
  const arr2 = Array.from(set2);
  const result = new Set<CellKey>();

  const maxLength = Math.max(arr1.length, arr2.length);
  for (let i = 0; i < maxLength; i++) {
    if (i < arr1.length) result.add(arr1[i]);
    if (i < arr2.length) result.add(arr2[i]);
  }

  return result;
}

export async function BidirectionalSwarm() {
  const { gridDim, cellWeightMatrix, startCellKey, endCellKey, realtime, setDisableButtons } = useStateStore.getState();

  const startQueue: CellKey[] = [startCellKey!];
  const endQueue: CellKey[] = [endCellKey!];

  const visitedFromStart = new Set<CellKey>([startCellKey!]);
  const visitedFromEnd = new Set<CellKey>([endCellKey!]);

  const parentFromStart = new Map<CellKey, CellKey>();
  const parentFromEnd = new Map<CellKey, CellKey>();

  let meetingNode: CellKey | null = null;

  while (startQueue.length > 0 && endQueue.length > 0) {
    const currentStart = startQueue.shift()!;
    visitedFromStart.add(currentStart);

    const startNeighbours = getNeighbours(currentStart, cellWeightMatrix, gridDim);
    for (const neighbour of startNeighbours) {
      if (!visitedFromStart.has(neighbour)) {
        visitedFromStart.add(neighbour);
        parentFromStart.set(neighbour, currentStart);
        startQueue.push(neighbour);

        if (visitedFromEnd.has(neighbour)) {
          meetingNode = neighbour;
          break;
        }
      }
    }
    if (meetingNode) break;

    const currentEnd = endQueue.shift()!;
    visitedFromEnd.add(currentEnd);

    const endNeighbours = getNeighbours(currentEnd, cellWeightMatrix, gridDim);
    for (const neighbour of endNeighbours) {
      if (!visitedFromEnd.has(neighbour)) {
        visitedFromEnd.add(neighbour);
        parentFromEnd.set(neighbour, currentEnd);
        endQueue.push(neighbour);

        if (visitedFromStart.has(neighbour)) {
          meetingNode = neighbour;
          break;
        }
      }
    }
    if (meetingNode) break;
  }

  let path: CellKey[] = [];
  if (meetingNode) {
    const pathFromStart = reconstructPath(startCellKey!, meetingNode, parentFromStart);
    const pathFromEnd = reconstructPath(endCellKey!, meetingNode, parentFromEnd);
    path = [...pathFromStart, ...pathFromEnd.reverse(), "-1,-1"];
  }

  const visitedAll = interleaveSets(visitedFromStart, visitedFromEnd);

  await runAlgorithm(realtime, visitedAll, path);
  setDisableButtons(false);
}
