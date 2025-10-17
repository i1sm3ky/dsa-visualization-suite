import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar-div">
      <a href="" className="navbar-title-logo-link">
        <div className="navbar-logo-div">
          <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 512 512" fill="currentcolor">
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
        </div>
        <div className="navbar-title-div">
          Searching Visualizer
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
