import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar-div">
      <a href="" className="navbar-title-logo-link">
        <div className="navbar-logo-div">
          <img className="navbar-logo" src="/pathfinding/Logo.svg" alt="Logo" />
        </div>
        <div className="navbar-title-div">
          Pathfinding Visualizer
          <div className="navbar-title-by-div">
            by <span className="navbar-title-by-name">i1sm3ky</span>
          </div>
        </div>
      </a>
      <div className="navbar-links-div">
        <a href="">Other Visualizers</a>
        <a href="">Portfolio</a>
        <a href="">Contact me</a>
      </div>
    </nav>
  );
};

export default Navbar;
