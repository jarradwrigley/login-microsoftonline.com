/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, HStack, Icon, Image, Link, Text, VStack } from "@chakra-ui/react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import VerificationOverlay from "../components/custom/VerificationOverlay";
import { io } from "socket.io-client";
import useAuth from "../hooks/useAuth";

const UserLanding = () => {
  const { steps, isVerifying, verificationMessage, currentStep } = useAuth();

  const [ipAddress, setIpAddress] = useState(null);

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        // Using ipify API as an example - you can use any IP lookup service
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error("Error fetching IP:", error);
        // Fallback value to indicate IP fetch failed
        setIpAddress("unknown");
      }
    };

    fetchIpAddress();
  }, []);

  return (
    <Box
      className="container-fluid"
      style={{
        backgroundImage: `url('/images/newbg.svg')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
      w="100vw"
      h="100vh"
    >
      <VStack
        w="100%"
        h="100%"
        alignItems="center"
        justifyContent="space-between"
        pt={currentStep === 2 ? "0" : "70px"}
      >
        <Box
          id="form-box"
          w="440px"
          position="relative"
          // minW="320px"
          // h="100%"
          bg="#fff"
          // mb="20px"
          overflowX="hidden"
          overflowY="auto"
          boxShadow="rgba(0, 0, 0, 0.2) 0px 2px 6px"
          // p="44px"
          // position="relative"
        >
          <Box position="relative" w="100%" h="100%" overflow="hidden">
            <Image
              px="44px"
              pt="44px"
              src="/images/ms.svg"
              alt="logo"
              mb="20px"
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={steps[currentStep].id}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ type: "tween" }}
                style={{
                  // position: "absolute",
                  width: "100%",
                  // height: "100%",
                  // padding: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {steps[currentStep].render()}
              </motion.div>
            </AnimatePresence>
          </Box>
          {isVerifying && (
            <VerificationOverlay
              isLoading={isVerifying}
              message={verificationMessage}
            />
          )}
        </Box>
      </VStack>
    </Box>
    // </div>
  );
};

export default UserLanding;
