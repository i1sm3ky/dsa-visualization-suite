import { useStateStore } from "../../store";
import { CellKey, Cell } from "../../types";
import { sleep, getCellRowColFromKey } from "../../utils";

export function getNeighbours(key: CellKey, cellWeightMatrix: number[][], gridDim: number[]) {
  const [row, col] = getCellRowColFromKey(key);
  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  const neighbours: CellKey[] = [];

  for (const [dr, dc] of directions) {
    const r = row + dr;
    const c = col + dc;

    if (r >= 0 && c >= 0 && r < gridDim[0] && c < gridDim[1]) {
      if (cellWeightMatrix[r][c] !== Infinity) {
        neighbours.push(`${r},${c}`);
      }
    }
  }

  return neighbours;
}

export function heuristic(a: CellKey, b: CellKey): number {
  const [ax, ay] = a.split(",").map(Number);
  const [bx, by] = b.split(",").map(Number);
  return Math.abs(ax - bx) + Math.abs(ay - by);
}

export function reconstructPath(startCellKey: CellKey, endCellKey: CellKey, parentMap: Map<CellKey, CellKey>) {
  const path: CellKey[] = [];
  let current: CellKey | undefined = endCellKey;

  while (current && current !== startCellKey) {
    path.unshift(current);
    current = parentMap.get(current);
  }

  return path;
}

export async function animateVisit(visitedCells: Set<CellKey>): Promise<void> {
  const { setVisited, animationSpeed } = useStateStore.getState();

  const cellsArray = [...visitedCells];
  for (let index = 0; index < cellsArray.length; index++) {
    setVisited(cellsArray[index], index + 1);
    await sleep(animationSpeed);
  }
}

export async function resetPathObject(startCellKey: CellKey) {
  const pathObject: HTMLDivElement = document.querySelector(".path-object")!;

  const [row, col] = getCellRowColFromKey(startCellKey);
  const cell = document.querySelector(`.cell-${row}-${col}`)!;
  const rect = cell.getBoundingClientRect();
  pathObject.style.opacity = "0";
  await sleep(350);
  pathObject.style.display = "none";
  pathObject.style.top = rect.top + "px";
  pathObject.style.left = rect.left + "px";
}

function getRotationFromCells(currentCell: CellKey, nextCell: CellKey) {
  const [curRow, curCol] = getCellRowColFromKey(currentCell);
  const [nextRow, nextCol] = getCellRowColFromKey(nextCell);

  const dx = nextCol - curCol;
  const dy = nextRow - curRow;

  if (dx === 1 && dy === 0) return 0;
  if (dx === -1 && dy === 0) return 180;
  if (dx === 0 && dy === 1) return 90;
  if (dx === 0 && dy === -1) return -90;

  return 0;
}

export async function animatePath(path: CellKey[]): Promise<void> {
  const { setPath, animationSpeed } = useStateStore.getState();

  const pathObject: HTMLDivElement = document.querySelector(".path-object")!;
  let prevRotation = 0;

  pathObject.style.display = "initial";
  pathObject.style.opacity = "1";

  for (let index = 0; index < path.length - 1; index++) {
    setPath(path[index], index + 1);

    const [row, col] = getCellRowColFromKey(path[index]);
    const cell = document.querySelector(`.cell-${row}-${col}`)!;
    const rect = cell.getBoundingClientRect();
    const scrollOffset = window.pageYOffset || document.documentElement.scrollTop;

    pathObject.style.top = rect.top + scrollOffset + rect.height / 4 + "px";
    pathObject.style.left = rect.left + "px";

    const rotation = getRotationFromCells(path[index], path[index + 1]);
    if (prevRotation !== rotation) {
      prevRotation = rotation;
      await sleep(150);
    }
    pathObject.style.transform = `rotate(${rotation}deg)`;

    await sleep(50 + animationSpeed);
  }
}

export function showVisit(visitedCells: Set<CellKey>) {
  const { setBatchCellState } = useStateStore.getState();

  setBatchCellState(
    Array.from(visitedCells, (key, index) => {
      const [x, y] = getCellRowColFromKey(key);
      return { x, y, updates: { isVisited: index + 1 } as Partial<Cell> };
    })
  );
}

export function showPath(path: CellKey[]) {
  const { setBatchCellState } = useStateStore.getState();

  setBatchCellState(
    path.map((key, index) => {
      const [x, y] = getCellRowColFromKey(key);
      return { x, y, updates: { isPath: index + 1 } };
    })
  );
}

export async function runAlgorithm(realtime: boolean, visitedSet: Set<CellKey>, path: CellKey[]) {
  if (realtime) {
    showVisit(visitedSet);
    showPath(path);
  } else {
    await animateVisit(visitedSet);
    await animatePath(path);
  }
}
