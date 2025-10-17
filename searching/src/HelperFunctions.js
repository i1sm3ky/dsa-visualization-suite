const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function moveTo(element, position, speed, func = "", topOffset = 150) {
  let offset = document.querySelector(position).getBoundingClientRect();
  document.querySelector(element).style.top = `${offset.top + window.scrollY - topOffset}px`;
  document.querySelector(element).style.left = `${offset.left}px`;

  document.documentElement.style.setProperty("--comparing-speed", speed);

  await sleep(300);

  if (func === "compareKey") {
    document.querySelector(element).style.setProperty("--initial-pos", "0px");
    document.querySelector(element).classList.add("comparing");
    setTimeout(() => document.querySelector(element).classList.remove("comparing"), speed - 10);
  }

  if (func === "compare") {
    document.querySelector(".comparing-arrow").classList.add("comparing-retract");
    setTimeout(() => document.querySelector(".comparing-arrow").classList.remove("comparing-retract"), speed - 20);
    document.querySelector(".arrow-head").classList.add("comparing-retract-arrow");
    setTimeout(() => document.querySelector(".arrow-head").classList.remove("comparing-retract-arrow"), speed - 20);

    document.querySelector(position).classList.add("comparing");
    setTimeout(() => document.querySelector(position).classList.remove("comparing"), speed);
  }
  if (func === "merge") {
    document.querySelector(element).style.top = `${offset.top + window.scrollY + 19}px`;
    document.querySelector(element).style.left = `${offset.left}px`;
    document.querySelector(element).style.backgroundColor = "#77DD77";
    document.querySelector(element).style.opacity = 0;
    document.querySelector(".comparing-arrow").style.opacity = 0;

    setTimeout(() => {
      document.querySelector(".comparing-arrow").style.opacity = 1;
      document.querySelector(element).style.backgroundColor = "#F88379";
      document.querySelector(element).style.opacity = 1;
    }, speed);
  }
  await sleep(speed);
}

export async function showOutput(state, index = 0, msg = "") {
  let toastIcon = "";
  let toastMsg = "";
  if (state === "found") {
    toastIcon = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 80 80">
          <path fill="#bae0bd" d="M40,77.5C19.3,77.5,2.5,60.7,2.5,40S19.3,2.5,40,2.5S77.5,19.3,77.5,40S60.7,77.5,40,77.5z"></path>
          <path fill="#5e9c76" d="M40,3c20.4,0,37,16.6,37,37S60.4,77,40,77S3,60.4,3,40S19.6,3,40,3 M40,2C19,2,2,19,2,40s17,38,38,38 s38-17,38-38S61,2,40,2L40,2z"></path>
          <path fill="#fff" d="M34 56L20.2 42.2 24.5 38 34 47.6 58.2 23.4 62.5 27.6z"></path>
        </svg>`;
    toastMsg = `<span class="toast-msg">Found element at index:</span> <span class="toast-msg toast-element-at-index">${index}</span>`;
  } else if (state === "notFound") {
    toastIcon = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 26 26" style="fill: #FA5252">
          <path d="M 13 0.1875 C 5.925781 0.1875 0.1875 5.925781 0.1875 13 C 0.1875 20.074219 5.925781 25.8125 13 25.8125 C 20.074219 25.8125 25.8125 20.074219 25.8125 13 C 25.8125 5.925781 20.074219 0.1875 13 0.1875 Z M 18.78125 17.394531 L 17.390625 18.78125 C 17.136719 19.035156 16.722656 19.035156 16.46875 18.78125 L 13 15.3125 L 9.53125 18.78125 C 9.277344 19.035156 8.863281 19.035156 8.609375 18.777344 L 7.21875 17.394531 C 6.96875 17.136719 6.96875 16.726563 7.21875 16.46875 L 10.6875 13 L 7.222656 9.535156 C 6.96875 9.277344 6.96875 8.863281 7.222656 8.609375 L 8.609375 7.222656 C 8.863281 6.964844 9.28125 6.964844 9.535156 7.222656 L 13 10.6875 L 16.46875 7.222656 C 16.722656 6.964844 17.140625 6.964844 17.390625 7.222656 L 18.78125 8.605469 C 19.035156 8.863281 19.035156 9.277344 18.78125 9.535156 L 15.3125 13 L 18.78125 16.46875 C 19.03125 16.726563 19.03125 17.136719 18.78125 17.394531 Z"></path>
        </svg>`;
    toastMsg = `<span class="toast-msg">Element not in array!</span>`;
  } else if (state === "enterTarget") {
    toastIcon = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 111.24" height="20" width="20"><defs><style>.cls-1{fill:#eece5a;fill-rule:evenodd;}.cls-2{fill:#2a2a2a;}</style></defs><title>risk</title><path d="M2.5,85l43-74.41h0a22.59,22.59,0,0,1,8-8.35,15.72,15.72,0,0,1,16,0,22.52,22.52,0,0,1,7.93,8.38l.23.44,42.08,73.07a20.91,20.91,0,0,1,3,10.84A16.44,16.44,0,0,1,121,102.4a15.45,15.45,0,0,1-5.74,6,21,21,0,0,1-11.35,2.78v0H17.7c-.21,0-.43,0-.64,0a19,19,0,0,1-7.83-1.74,15.83,15.83,0,0,1-6.65-5.72A16.26,16.26,0,0,1,0,95.18a21.66,21.66,0,0,1,2.2-9.62c.1-.2.2-.4.31-.59Z"/><path class="cls-1" d="M9.09,88.78l43-74.38c5.22-8.94,13.49-9.2,18.81,0l42.32,73.49c4.12,6.79,2.41,15.9-9.31,15.72H17.7C9.78,103.79,5,97.44,9.09,88.78Z"/><path class="cls-2" d="M57.55,83.15a5.47,5.47,0,0,1,5.85-1.22,5.65,5.65,0,0,1,2,1.3A5.49,5.49,0,0,1,67,86.77a5.12,5.12,0,0,1-.08,1.4,5.22,5.22,0,0,1-.42,1.34,5.51,5.51,0,0,1-5.2,3.25,5.63,5.63,0,0,1-2.26-.53,5.51,5.51,0,0,1-2.81-2.92A6,6,0,0,1,55.9,88a5.28,5.28,0,0,1,0-1.31h0a6,6,0,0,1,.56-2,4.6,4.6,0,0,1,1.14-1.56Zm8.12-10.21c-.19,4.78-8.28,4.78-8.46,0-.82-8.19-2.92-27.63-2.85-35.32.07-2.37,2-3.78,4.55-4.31a11.65,11.65,0,0,1,2.48-.25,12.54,12.54,0,0,1,2.5.25c2.59.56,4.63,2,4.63,4.43V38l-2.84,35Z"/></svg>`;
    toastMsg = `<span class="toast-msg">Please enter a target value to search for!</span>`;
  } else if (state === "enterInt") {
    toastIcon = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 111.24" height="20" width="20"><defs><style>.cls-1{fill:#eece5a;fill-rule:evenodd;}.cls-2{fill:#2a2a2a;}</style></defs><title>risk</title><path d="M2.5,85l43-74.41h0a22.59,22.59,0,0,1,8-8.35,15.72,15.72,0,0,1,16,0,22.52,22.52,0,0,1,7.93,8.38l.23.44,42.08,73.07a20.91,20.91,0,0,1,3,10.84A16.44,16.44,0,0,1,121,102.4a15.45,15.45,0,0,1-5.74,6,21,21,0,0,1-11.35,2.78v0H17.7c-.21,0-.43,0-.64,0a19,19,0,0,1-7.83-1.74,15.83,15.83,0,0,1-6.65-5.72A16.26,16.26,0,0,1,0,95.18a21.66,21.66,0,0,1,2.2-9.62c.1-.2.2-.4.31-.59Z"/><path class="cls-1" d="M9.09,88.78l43-74.38c5.22-8.94,13.49-9.2,18.81,0l42.32,73.49c4.12,6.79,2.41,15.9-9.31,15.72H17.7C9.78,103.79,5,97.44,9.09,88.78Z"/><path class="cls-2" d="M57.55,83.15a5.47,5.47,0,0,1,5.85-1.22,5.65,5.65,0,0,1,2,1.3A5.49,5.49,0,0,1,67,86.77a5.12,5.12,0,0,1-.08,1.4,5.22,5.22,0,0,1-.42,1.34,5.51,5.51,0,0,1-5.2,3.25,5.63,5.63,0,0,1-2.26-.53,5.51,5.51,0,0,1-2.81-2.92A6,6,0,0,1,55.9,88a5.28,5.28,0,0,1,0-1.31h0a6,6,0,0,1,.56-2,4.6,4.6,0,0,1,1.14-1.56Zm8.12-10.21c-.19,4.78-8.28,4.78-8.46,0-.82-8.19-2.92-27.63-2.85-35.32.07-2.37,2-3.78,4.55-4.31a11.65,11.65,0,0,1,2.48-.25,12.54,12.54,0,0,1,2.5.25c2.59.56,4.63,2,4.63,4.43V38l-2.84,35Z"/></svg>`;
    toastMsg = `<span class="toast-msg">Please enter a integer value to search!</span>`;
  } else if (state === "incorrectArrayFormat") {
    toastIcon = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 111.24" height="20" width="20"><defs><style>.cls-1{fill:#eece5a;fill-rule:evenodd;}.cls-2{fill:#2a2a2a;}</style></defs><title>risk</title><path d="M2.5,85l43-74.41h0a22.59,22.59,0,0,1,8-8.35,15.72,15.72,0,0,1,16,0,22.52,22.52,0,0,1,7.93,8.38l.23.44,42.08,73.07a20.91,20.91,0,0,1,3,10.84A16.44,16.44,0,0,1,121,102.4a15.45,15.45,0,0,1-5.74,6,21,21,0,0,1-11.35,2.78v0H17.7c-.21,0-.43,0-.64,0a19,19,0,0,1-7.83-1.74,15.83,15.83,0,0,1-6.65-5.72A16.26,16.26,0,0,1,0,95.18a21.66,21.66,0,0,1,2.2-9.62c.1-.2.2-.4.31-.59Z"/><path class="cls-1" d="M9.09,88.78l43-74.38c5.22-8.94,13.49-9.2,18.81,0l42.32,73.49c4.12,6.79,2.41,15.9-9.31,15.72H17.7C9.78,103.79,5,97.44,9.09,88.78Z"/><path class="cls-2" d="M57.55,83.15a5.47,5.47,0,0,1,5.85-1.22,5.65,5.65,0,0,1,2,1.3A5.49,5.49,0,0,1,67,86.77a5.12,5.12,0,0,1-.08,1.4,5.22,5.22,0,0,1-.42,1.34,5.51,5.51,0,0,1-5.2,3.25,5.63,5.63,0,0,1-2.26-.53,5.51,5.51,0,0,1-2.81-2.92A6,6,0,0,1,55.9,88a5.28,5.28,0,0,1,0-1.31h0a6,6,0,0,1,.56-2,4.6,4.6,0,0,1,1.14-1.56Zm8.12-10.21c-.19,4.78-8.28,4.78-8.46,0-.82-8.19-2.92-27.63-2.85-35.32.07-2.37,2-3.78,4.55-4.31a11.65,11.65,0,0,1,2.48-.25,12.54,12.54,0,0,1,2.5.25c2.59.56,4.63,2,4.63,4.43V38l-2.84,35Z"/></svg>`;
    toastMsg = `<span class="toast-msg">Please enter array in the specified format!</span>`;
  } else if (state === "enterArrayElements") {
    toastIcon = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 111.24" height="20" width="20"><defs><style>.cls-1{fill:#eece5a;fill-rule:evenodd;}.cls-2{fill:#2a2a2a;}</style></defs><title>risk</title><path d="M2.5,85l43-74.41h0a22.59,22.59,0,0,1,8-8.35,15.72,15.72,0,0,1,16,0,22.52,22.52,0,0,1,7.93,8.38l.23.44,42.08,73.07a20.91,20.91,0,0,1,3,10.84A16.44,16.44,0,0,1,121,102.4a15.45,15.45,0,0,1-5.74,6,21,21,0,0,1-11.35,2.78v0H17.7c-.21,0-.43,0-.64,0a19,19,0,0,1-7.83-1.74,15.83,15.83,0,0,1-6.65-5.72A16.26,16.26,0,0,1,0,95.18a21.66,21.66,0,0,1,2.2-9.62c.1-.2.2-.4.31-.59Z"/><path class="cls-1" d="M9.09,88.78l43-74.38c5.22-8.94,13.49-9.2,18.81,0l42.32,73.49c4.12,6.79,2.41,15.9-9.31,15.72H17.7C9.78,103.79,5,97.44,9.09,88.78Z"/><path class="cls-2" d="M57.55,83.15a5.47,5.47,0,0,1,5.85-1.22,5.65,5.65,0,0,1,2,1.3A5.49,5.49,0,0,1,67,86.77a5.12,5.12,0,0,1-.08,1.4,5.22,5.22,0,0,1-.42,1.34,5.51,5.51,0,0,1-5.2,3.25,5.63,5.63,0,0,1-2.26-.53,5.51,5.51,0,0,1-2.81-2.92A6,6,0,0,1,55.9,88a5.28,5.28,0,0,1,0-1.31h0a6,6,0,0,1,.56-2,4.6,4.6,0,0,1,1.14-1.56Zm8.12-10.21c-.19,4.78-8.28,4.78-8.46,0-.82-8.19-2.92-27.63-2.85-35.32.07-2.37,2-3.78,4.55-4.31a11.65,11.65,0,0,1,2.48-.25,12.54,12.54,0,0,1,2.5.25c2.59.56,4.63,2,4.63,4.43V38l-2.84,35Z"/></svg>`;
    toastMsg = `<span class="toast-msg">Please enter elements to be put in array!</span>`;
  } else if (state === "info") {
    toastIcon = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24"
    style="fill:#228BE6;">
        <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 9 L 13 9 L 13 7 L 11 7 z M 11 11 L 11 17 L 13 17 L 13 11 L 11 11 z"></path>
    </svg>`;
    toastMsg = `<span class="toast-msg">${msg}</span>`;
  }

  let toastIconDiv = document.createElement("div");
  toastIconDiv.style.transform = "scale(0) rotate(60deg)";
  toastIconDiv.style.transition = "transform 0.5s";
  toastIconDiv.innerHTML = toastIcon;

  let toastMsgDiv = document.createElement("div");
  toastMsgDiv.innerHTML = toastMsg;

  let toastProgressDiv = document.createElement("div");
  toastProgressDiv.classList.add("toast-progress-bar");

  let toast = document.createElement("div");
  toast.classList.add("toast");
  toast.appendChild(toastIconDiv);
  toast.appendChild(toastMsgDiv);
  toast.appendChild(toastProgressDiv);

  document.querySelector(".toast-sibling").insertAdjacentElement("afterend", toast);
  await sleep(100);
  toast.classList.add("show-toast");
  setTimeout(() => (toastIconDiv.style.transform = "scale(1) rotate(0)"), 1000);
  setTimeout(() => {
    toastProgressDiv.style.width = "0";
    toastProgressDiv.style.borderBottomRightRadius = "0";
  }, 1000);

  setTimeout(() => {
    toast.classList.add("hide-toast");
    setTimeout(() => {
      toast.classList.remove("show-toast");
      toast.classList.remove("hide-toast");
      toast.remove();
    }, 2000);
  }, 3000);
}
