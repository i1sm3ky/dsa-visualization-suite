import { useStateStore } from "../../store";
import { animateMaze } from "./utils";
import { recursiveDivision } from "./RecursiveDivision";

function chooseOrientation(height: number, width: number) {
  if (width < height) return "H";
  else if (height < width) return "V";
  return Math.random() < 0.5 ? "H" : "V";
}

export async function RecursiveDivisionBalanced() {
  const { gridDim, setDisableButtons } = useStateStore.getState();
  const steps: { row: number; col: number }[] = [];

  recursiveDivision(0, gridDim[0] - 1, 0, gridDim[1] - 1, chooseOrientation(gridDim[0], gridDim[1]), steps, chooseOrientation);

  await animateMaze(steps);
  setDisableButtons(false);
}
