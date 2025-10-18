import { useStateStore } from "../../store";
import { animateMaze } from "./utils";
import { recursiveDivision } from "./RecursiveDivision";

function chooseOrientation() {
  return Math.random() < 0.75 ? "H" : "V";
}

export async function RecursiveDivisionHorizontal() {
  const { gridDim, setDisableButtons } = useStateStore.getState();
  const steps: { row: number; col: number }[] = [];

  recursiveDivision(0, gridDim[0] - 1, 0, gridDim[1] - 1, chooseOrientation(), steps, chooseOrientation);

  await animateMaze(steps);
  setDisableButtons(false);
}
