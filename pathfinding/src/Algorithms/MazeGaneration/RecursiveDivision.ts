import { randomParity } from "./utils";

export async function recursiveDivision(rowStart: number, rowEnd: number, colStart: number, colEnd: number, orientation: "H" | "V", steps: { row: number; col: number }[], chooseOrientation: Function) {
  if (rowEnd - rowStart < 3 || colEnd - colStart < 3) return;

  if (orientation === "H") {
    const wallRow = randomParity(rowStart + 1, rowEnd - 1, true);
    const passageCol = randomParity(colStart, colEnd, false);

    for (let c = colStart; c <= colEnd; c++) {
      if (c !== passageCol) steps.push({ row: wallRow, col: c });
    }

    recursiveDivision(rowStart, wallRow - 1, colStart, colEnd, chooseOrientation(wallRow - rowStart, colEnd - colStart + 1), steps, chooseOrientation);
    recursiveDivision(wallRow + 1, rowEnd, colStart, colEnd, chooseOrientation(rowEnd - wallRow, colEnd - colStart + 1), steps, chooseOrientation);
  } else {
    const wallCol = randomParity(colStart + 1, colEnd - 1, true);
    const passageRow = randomParity(rowStart, rowEnd, false);

    for (let r = rowStart; r <= rowEnd; r++) {
      if (r !== passageRow) steps.push({ row: r, col: wallCol });
    }

    recursiveDivision(rowStart, rowEnd, colStart, wallCol - 1, chooseOrientation(rowEnd - rowStart + 1, wallCol - colStart), steps, chooseOrientation);
    recursiveDivision(rowStart, rowEnd, wallCol + 1, colEnd, chooseOrientation(rowEnd - rowStart + 1, colEnd - wallCol), steps, chooseOrientation);
  }
}
