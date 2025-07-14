/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import DotsAnimation from "./AnimatedBoxShowcase";

const VerificationOverlay = ({ isLoading, message }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const formBoxRef = useRef(null);

  useEffect(() => {
    const updateDimensions = () => {
      const formBox = document.getElementById("form-box");
      if (formBox) {
        const rect = formBox.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    // Initial dimension capture
    updateDimensions();

    // Capture dimensions on window resize
    window.addEventListener("resize", updateDimensions);

    // Optional: use MutationObserver to capture dimension changes due to content
    const observer = new MutationObserver(updateDimensions);
    const formBox = document.getElementById("form-box");
    if (formBox) {
      observer.observe(formBox, {
        childList: true,
        subtree: true,
        attributes: true,
      });

      return () => {
        window.removeEventListener("resize", updateDimensions);
        observer.disconnect();
      };
    }
  }, []);

  return (
    <Box
      id="lay"
      position="absolute"
      inset="0"
      bg="rgba(255, 255, 255, 0.5)"
      display="flex"
    >
      {/* <AnimatedDots /> */}
      <DotsAnimation />
    </Box>
  );
};

export default VerificationOverlay;
