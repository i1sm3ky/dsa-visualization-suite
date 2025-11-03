import { useStateStore } from "../store";

import "./SpaceEdge.css";

function SpaceEdge() {
  const mode = useStateStore((state) => state.mode);

  return <div className={`space-edge space-edge-${mode}`}></div>;
}
export default SpaceEdge;
