import "./ArrayElement.css";

const ArrayElement = ({ index, value }) => {
  return (
    <div className={`array-element array-element-reveal array-element-${index}`} style={{ "--array-element-in-delay": index }}>
      <div className="element-index">{index}</div>
      <div className="element-value">{value}</div>
    </div>
  );
};

export default ArrayElement;
