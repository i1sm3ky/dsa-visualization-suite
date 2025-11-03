import { useStateStore } from "../../store";
import { getCellRowColFromKey } from "../../utils";
import { animateMaze } from "./utils";

export async function RecursiveBacktrackingDFS() {
  const { gridDim, setDisableButtons, startCellKey, endCellKey } = useStateStore.getState();
  const startCell = getCellRowColFromKey(startCellKey!);
  const endCell = getCellRowColFromKey(endCellKey!);
  const [rows, cols] = gridDim;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const carved = new Set<string>();

  const steps: { row: number; col: number }[] = [];

  const directions = [
    [0, 2],
    [2, 0],
    [0, -2],
    [-2, 0],
  ];

  function isValid(r: number, c: number) {
    return r >= 0 && c >= 0 && r < rows && c < cols && !visited[r][c];
  }

  function key(r: number, c: number) {
    return `${r},${c}`;
  }

  async function dfs(r: number, c: number) {
    visited[r][c] = true;
    carved.add(key(r, c));

    const shuffled = directions.sort(() => Math.random() - 0.5);
    for (const [dr, dc] of shuffled) {
      const nr = r + dr;
      const nc = c + dc;

      if (isValid(nr, nc)) {
        const wallRow = r + dr / 2;
        const wallCol = c + dc / 2;
        carved.add(key(wallRow, wallCol));
        carved.add(key(nr, nc));
        await dfs(nr, nc);
      }
    }
  }

  const startR = startCell?.[0] ?? 0;
  const startC = startCell?.[1] ?? 0;
  await dfs(startR, startC);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = key(r, c);
      if (!carved.has(k)) {
        steps.push({ row: r, col: c });
      }
    }
  }

  if (startCell) carved.add(startCellKey!);
  if (endCell) carved.add(endCellKey!);
  if (startCell) steps.filter((s) => s.row !== startCell[0] || s.col !== startCell[1]);
  if (endCell) steps.filter((s) => s.row !== endCell[0] || s.col !== endCell[1]);

  await animateMaze(steps);
  setDisableButtons(false);
}
