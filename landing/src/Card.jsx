import "./Card.css";

function Card({ logo, title, link, color1, color2, children }) {
  return (
    <div className="card-parent">
      <div className="card-container" style={{ "--color1": color1, "--color2": color2 }}>
        <div className="card-header"></div>
        <div className="card-inner-container">
          <div className="logo-div">
            <img src={logo} alt="Logo" className="logo-img" />
          </div>
          <div className="card-content-div">
            <div className="card-title-1">{title}</div>
            <div className="card-feature">{children}</div>
            <div className="card-title-2">Visualizer</div>
            <div className="card-callback-div">
              {link ? (
                <a className="card-btn" href={link}>
                  Visit
                </a>
              ) : (
                <div className="card-coming-soon">Coming soon</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Card;
