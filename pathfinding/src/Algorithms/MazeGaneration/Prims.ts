import { useStateStore } from "../../store";
import { getCellRowColFromKey } from "../../utils";
import { animateMaze } from "./utils";

export async function Prims() {
  const { gridDim, setDisableButtons, startCellKey, endCellKey } = useStateStore.getState();
  const [rows, cols] = gridDim;
  const steps: { row: number; col: number }[] = [];
  const startCell = getCellRowColFromKey(startCellKey!);
  const endCell = getCellRowColFromKey(endCellKey!);

  const visited = new Set<string>();
  const inMaze = new Set<string>();
  const wallQueue: [number, number][] = [];

  function key(r: number, c: number) {
    return `${r},${c}`;
  }

  function neighbors(r: number, c: number): [number, number][] {
    return [
      [r - 2, c],
      [r + 2, c],
      [r, c - 2],
      [r, c + 2],
    ].filter(([nr, nc]) => nr >= 0 && nc >= 0 && nr < rows && nc < cols) as [number, number][];
  }

  const startR = startCell?.[0] ?? 0;
  const startC = startCell?.[1] ?? 0;

  visited.add(key(startR, startC));
  inMaze.add(key(startR, startC));

  for (const [nr, nc] of neighbors(startR, startC)) {
    wallQueue.push([nr, nc]);
  }

  while (wallQueue.length > 0) {
    const index = Math.floor(Math.random() * wallQueue.length);
    const [r, c] = wallQueue.splice(index, 1)[0];
    const k = key(r, c);

    if (visited.has(k)) continue;

    const mazeNeighbors = neighbors(r, c).filter(([nr, nc]) => inMaze.has(key(nr, nc)));
    if (mazeNeighbors.length === 0) continue;

    const [adjR, adjC] = mazeNeighbors[Math.floor(Math.random() * mazeNeighbors.length)];

    const wallRow = (r + adjR) / 2;
    const wallCol = (c + adjC) / 2;

    inMaze.add(k);
    inMaze.add(key(wallRow, wallCol));
    visited.add(k);

    for (const [nr, nc] of neighbors(r, c)) {
      if (!visited.has(key(nr, nc))) {
        wallQueue.push([nr, nc]);
      }
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = key(r, c);
      if (!inMaze.has(k)) {
        steps.push({ row: r, col: c });
      }
    }
  }

  if (startCell) steps.filter((s) => s.row !== startCell[0] || s.col !== startCell[1]);
  if (endCell) steps.filter((s) => s.row !== endCell[0] || s.col !== endCell[1]);

  await animateMaze(steps);
  setDisableButtons(false);
}
