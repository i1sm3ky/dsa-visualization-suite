import { useEffect } from "react";
import { useStateStore } from "./store";
import ToolBar from "./Components/ToolBar";
import Grid from "./Components/Grid";
import AlgoDetails from "./Components/AlgoDetails";

import "./MainApp.css";

function MainApp() {
  const setMouseDown = useStateStore((state) => state.setMouseDown);

  useEffect(() => {
    const handleMouseUp = () => setMouseDown(false);
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);
  return (
    <>
      <ToolBar />
      <div className="grid-container">
        <Grid />
      </div>
      <AlgoDetails />
    </>
  );
}
export default MainApp;
