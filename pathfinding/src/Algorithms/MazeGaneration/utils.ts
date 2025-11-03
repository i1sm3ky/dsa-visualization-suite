import { useStateStore } from "../../store";
import { sleep } from "../../utils";

// import { useStateStore } from "../../store";
// import { CellType } from "../../types";

// export function fillWithCellType(newType: CellType) {
//   const { gridDim, setBatchCellState, setCellState } = useStateStore.getState();

//   // const totalCells = gridDim[0] * gridDim[1];
//   // const updates = new Array(totalCells);

//   // let index = 0;
//   for (let row = 0; row < gridDim[0]; row++) {
//     for (let col = 0; col < gridDim[1]; col++) {
//       setCellState(row, col, { type: newType });
//       // updates[index++] = { x: row, y: col, updates: { type: newType } };
//     }
//   }
//   // setBatchCellState(updates);
// }

// export function shuffle(arr: number[][]) {
//   for (let i = arr.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     const temp = arr[i];
//     arr[i] = arr[j];
//     arr[i] = temp;
//   }

//   return arr;
// }

// export function isInBounds(row: number, col: number, gridDim: number[]) {
//   return row >= 0 && col >= 0 && col < gridDim[0] && row < gridDim[1];
// }

export function randomParity(min: number, max: number, even: boolean): number {
  if ((min % 2 === 0) !== even) min++;

  const count = Math.floor((max - min) / 2) + 1;
  return min + 2 * Math.floor(Math.random() * count);
}

export async function animateMaze(steps: { row: number; col: number }[]) {
  const { setCellState, animationSpeed } = useStateStore.getState();
  for (const { row, col } of steps) {
    setCellState(row, col, { type: "wall" });
    await sleep(animationSpeed);
  }
}
