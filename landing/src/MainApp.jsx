import { useEffect } from "react";
import Card from "./Card";

import "./MainApp.css";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const handleTilt = (event, card) => {
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const middleX = rect.width / 2;
  const middleY = rect.height / 2;

  const offsetX = ((x - middleX) / middleX) * 30;
  const offsetY = ((y - middleY) / middleY) * 30;

  card.style.setProperty("--rotateX", offsetX + "deg");
  card.style.setProperty("--rotateY", -1 * offsetY + "deg");
};

const handleTiltLeave = async (card) => {
  let rotateX = card.style.getPropertyValue("--rotateX");
  let rotateY = card.style.getPropertyValue("--rotateY");
  rotateX = parseInt(rotateX);
  rotateY = parseInt(rotateY);
  while (rotateX !== 0 || rotateY !== 0) {
    await sleep(1);
    if (rotateX !== 0) rotateX += rotateX < 0 ? 1 : -1;
    card.style.setProperty("--rotateX", rotateX + "deg");
    if (rotateY !== 0) rotateY += rotateY < 0 ? 1 : -1;
    card.style.setProperty("--rotateY", rotateY + "deg");
  }
};

const tiltListeners = new Map();

function tiltInit() {
  const cardParents = document.querySelectorAll(".card-parent");

  cardParents.forEach((cardParent) => {
    const card = cardParent.children[0];
    const mouseMoveHandler = (e) => handleTilt(e, card);
    const mouseLeaveHandler = () => handleTiltLeave(card);

    cardParent.addEventListener("mousemove", mouseMoveHandler);
    cardParent.addEventListener("mouseleave", mouseLeaveHandler);

    tiltListeners.set(cardParent, {
      mouseMoveHandler,
      mouseLeaveHandler,
    });
  });
}

function tiltVoid() {
  const cardParents = document.querySelectorAll(".card-parent");

  cardParents.forEach((cardParent) => {
    const handlers = tiltListeners.get(cardParent);
    if (handlers) {
      cardParent.removeEventListener("mousemove", handlers.mouseMoveHandler);
      cardParent.removeEventListener("mouseleave", handlers.mouseLeaveHandler);
      tiltListeners.delete(cardParent);
    }
  });
}

const MainApp = () => {
  useEffect(() => {
    tiltInit();
    return () => {
      tiltVoid();
    };
  }, []);

  return (
    <div className="main-container">
      <Card logo="/SearchingLogo.svg" title="Searching" link="searching" color1="#11998e" color2="#38ef7d">
        <div className="searching-div">
          <div className="searching-block searching-block-1">10</div>
          <div className="searching-block searching-block-2">2</div>
          <div className="searching-block searching-block-3">7</div>
          <div className="searching-block searching-block-4">25</div>
          <div className="searching-block searching-block-5">3</div>
          <div className="searching-block searching-block-6">19</div>
          <div className="searching-block searching-block-7">14</div>
        </div>
      </Card>
      <Card logo="/SortingLogo.svg" title="Sorting" link="sorting" color1="#3f2b96" color2="#a8c0ff">
        <div className="sorting-div">
          <div className="sorting-block sorting-block-1" style={{ "--array-element-bg-color": "rgb(344,154,89)" }}>
            5
          </div>
          <div className="sorting-block sorting-block-2" style={{ "--array-element-bg-color": "rgb(89,344,260)" }}>
            7
          </div>
          <div className="sorting-block sorting-block-3" style={{ "--array-element-bg-color": "rgb(209,344,89)" }}>
            3
          </div>
          <div className="sorting-block sorting-block-4" style={{ "--array-element-bg-color": "rgb(110,89,344)" }}>
            2
          </div>
          <div className="sorting-block sorting-block-5" style={{ "--array-element-bg-color": "rgb(89,344,99)" }}></div>
          <div className="sorting-block sorting-block-6" style={{ "--array-element-bg-color": "rgb(274,344,89)" }}></div>
          <div className="sorting-block sorting-block-7" style={{ "--array-element-bg-color": "rgb(344,89,127)" }}></div>
        </div>
      </Card>
      <Card logo="/PathfindingLogo.svg" title="Pathfinding" link="pathfinding" color1="#7F00FF" color2="#E100FF">
        <div className="pathfinding-div">
          <div className="pathfinding-block pathfinding-block-1 pathfinding-path">S</div>
          <div className="pathfinding-block pathfinding-block-2 pathfinding-path"></div>
          <div className="pathfinding-block pathfinding-block-3 pathfinding-path"></div>
          <div className="pathfinding-block pathfinding-block-4 pathfinding-path"></div>
          <div className="pathfinding-block pathfinding-block-5 pathfinding-wall"></div>
          <div className="pathfinding-block pathfinding-block-6 pathfinding-wall"></div>
          <div className="pathfinding-block pathfinding-block-7  pathfinding-wall"></div>
          <div className="pathfinding-block pathfinding-block-8"></div>
          <div className="pathfinding-block pathfinding-block-9"></div>
          <div className="pathfinding-block pathfinding-block-10 pathfinding-wall"></div>
          <div className="pathfinding-block pathfinding-block-11 pathfinding-wall"></div>
          <div className="pathfinding-block pathfinding-block-12 pathfinding-path"></div>
          <div className="pathfinding-block pathfinding-block-13 pathfinding-path"></div>
          <div className="pathfinding-block pathfinding-block-14 pathfinding-path"></div>
          <div className="pathfinding-block pathfinding-block-15 pathfinding-path">F</div>
          <div className="pathfinding-block pathfinding-block-16 pathfinding-wall"></div>
        </div>
      </Card>
      <Card logo="/DSALogo.svg" title="Data Structure" link="" color1="#f12711" color2="#f5af19">
        <div className="dsa-div">
          <div className="dsa-block dsa-block-1">
            <div className="dsa-block-num">10</div>
            <img className="dsa-block-arrow" src="/RayEndArrow.svg" alt="Linked List Pointer" />
          </div>
          <div className="dsa-block dsa-block-2">
            <div className="dsa-block-num">19</div>
            <img className="dsa-block-arrow" src="/RayEndArrow.svg" alt="Linked List Pointer" />
          </div>
          <div className="dsa-block dsa-block-3">
            <div className="dsa-block-num">21</div>
            <img className="dsa-block-arrow" src="/RayEndArrow.svg" alt="Linked List Pointer" />
          </div>
          <div className="dsa-block dsa-block-4">
            <div className="dsa-block-num">12</div>
            <img className="dsa-block-arrow" src="/RayEndArrow.svg" alt="Linked List Pointer" />
          </div>
          <div className="dsa-block dsa-block-5">
            <div className="dsa-block-num">34</div>
            <img className="dsa-block-arrow" src="/RayEndArrow.svg" alt="Linked List Pointer" />
          </div>
          <div className="dsa-block dsa-block-6">
            <div className="dsa-block-num">17</div>
            <img className="dsa-block-arrow" src="/RayEndArrow.svg" alt="Linked List Pointer" />
          </div>
          <div className="dsa-block dsa-block-7">
            <div className="dsa-block-num">14</div>
            <img className="dsa-block-arrow" src="/RayEndArrow.svg" alt="Linked List Pointer" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MainApp;
