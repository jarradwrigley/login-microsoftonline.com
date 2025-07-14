/* eslint-disable no-unused-vars */
import React from "react";

const DotsAnimation = () => {
  return (
    <div className="dots-wrapper">
      <div className="dots"></div>
      <div className="dots"></div>
      <div className="dots"></div>
      <div className="dots"></div>
      <div className="dots"></div>
      <div className="dots"></div>
    </div>
  );
};

export default DotsAnimation;

/* Inline CSS if needed */
const styles = `
.dots-wrapper {
  width: 100%;
  height: 4px;
  max-width: 100%;
  position: relative;
  overflow: hidden;
}
.dots {
  position: absolute;
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 0;
  background-color: #00a4ef;
  animation: dots 3s infinite;
}
.dots:nth-child(2) {
  animation-delay: 0.1s;
}
.dots:nth-child(3) {
  animation-delay: 0.2s;
}
.dots:nth-child(4) {
  animation-delay: 0.3s;
}
.dots:nth-child(5) {
  animation-delay: 0.4s;
}
.dots:nth-child(6) {
  animation-delay: 0.5s;
}
@keyframes dots {
  0%,
  20% {
    left: 0;
    animation-timing-function: ease-out;
    opacity: 0;
  }
  25%,
  75% {
    opacity: 1;
  }
  35% {
    left: 45%;
    animation-timing-function: linear;
  }
  65% {
    left: 55%;
    animation-timing-function: ease-in;
  }
  100%,
  80% {
    left: 100%;
    opacity: 0;
  }
}`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
