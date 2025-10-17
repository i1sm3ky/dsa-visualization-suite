import "./ArrayElement.css";

const ArrayElement = ({ index, value, color, mode, height }) => {
  return (
    <div className={`array-element-parent array-element-${index} ${mode ? "" : "array-element-bar"}`}>
      <div className={`array-element ${mode ? "array-element-reveal-block" : "array-element-reveal-bar"} ${mode ? "array-element-block" : "array-element-bar"}`} style={{ "--array-element-in-delay": index, "--array-element-bg-color": color, "--array-element-height": mode ? "4em" : `${height}vh` }}></div>
      <div className={`element-value ${mode ? "array-element-reveal-block" : "array-element-reveal-bar"} ${mode ? "element-value-block" : "element-value-bar"}`} style={{ "--array-element-in-delay": index }}>
        {value}
      </div>
    </div>
  );
};

export default ArrayElement;
