import React, { useEffect, useRef } from "react";
import { sleep } from "../utils";

import "./Dropdown.css";

function Dropdown({ selectedOption, disabled, children }: { selectedOption: string; disabled: boolean; children: React.ReactNode }) {
  const dropdownSvg = useRef<SVGSVGElement>(null);
  const dropdownContent = useRef<HTMLDivElement>(null);
  const dropdownOption = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element;

      const isDropdownClick = target.matches(".dropdown-btn") || target.matches(".dropdown-option") || target.matches(".dropdown-icon");

      if (!isDropdownClick && dropdownContent.current) {
        dropdownContent.current.childNodes.forEach((element, index) => ((element as HTMLElement).style.transform = `translateY(-${index * 100}%)`));
        dropdownContent.current.style.height = "0";
        setTimeout(() => dropdownContent.current?.childNodes.forEach((element) => ((element as HTMLElement).style.opacity = "0")), 300);
        setTimeout(() => dropdownContent.current?.childNodes.forEach((element) => ((element as HTMLElement).style.display = "none")), 600);
      }
    };

    window.addEventListener("click", handleClick);

    dropdownContent.current!.childNodes.forEach((element, index) => ((element as HTMLElement).style.transform = `translateY(-${index * 100}%)`));
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  async function handleDropdownOptionChange() {
    if (dropdownOption.current!.innerHTML !== selectedOption) {
      while (dropdownOption.current!.innerHTML != "") {
        dropdownOption.current!.innerHTML = dropdownOption.current!.innerHTML.slice(0, -1);
        await sleep(20);
      }
      let index = 0;
      while (dropdownOption.current!.innerHTML != selectedOption) {
        dropdownOption.current!.innerHTML += selectedOption[index++];
        await sleep(20);
      }
    }
  }

  useEffect(() => {
    handleDropdownOptionChange();
  }, [selectedOption]);

  return (
    <div className="dropdown">
      <button
        className="dropdown-btn"
        onClick={() => {
          dropdownContent.current!.childNodes.forEach((element) => ((element as HTMLElement).style.display = "block"));
          dropdownSvg.current!.style.transform = "translateY(2px)";
          setTimeout(() => {
            dropdownSvg.current!.style.transform = "translateY(0)";
            dropdownContent.current!.childNodes.forEach((element) => ((element as HTMLElement).style.opacity = "1"));
            dropdownContent.current!.childNodes.forEach((element) => ((element as HTMLElement).style.transform = "translateY(0)"));
            dropdownContent.current!.style.height = `calc(calc(2em + 10px) * ${React.Children.count(children)})`;
          }, 300);
        }}
        disabled={disabled}
      >
        <div ref={dropdownOption} className="dropdown-option"></div>
        <svg ref={dropdownSvg} className="dropdown-icon" xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" viewBox="0 0 320 512" fill="currentcolor">
          <path d="m31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1l-128.6 128.7c-7.8 7.8-20.5 7.8-28.3 0l-128.6-128.7c-12.6-12.6-3.7-34.1 14.1-34.1z" />
        </svg>
      </button>
      <div ref={dropdownContent} className="dropdown-content">
        {children}
      </div>
    </div>
  );
}
export default Dropdown;
