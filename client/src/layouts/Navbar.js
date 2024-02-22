import React from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  VStack,
  Link,
  Button,
  Divider,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import ThemeToggler from "../components/ThemeToggler";
import { useAuth } from "../contexts/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuth, logout } = useAuth();

  // Function to handle the sign out button and delete the access token from local storage
    const handleSignOut = () => {
        axios.get("http://localhost:3001/auth/logout");
        toast.success("Logged out successfully!");
        setTimeout(() => {
          }, 500);
        logout();
        localStorage.removeItem("accessToken");
    };


  const NavBarButton = ({ link, text, onClick }) => {
    return (
      <Button
        as={Link}
        href={link}
        mx={4}
        fontSize="3xl"
        fontFamily="Serif"
        variant="ghost"
        onClick={onClick}
      >
        {text}
      </Button>
    );
  };

  return (
    <Box
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Flex
        px={4}
        py={3}
        align="center"
        justify="space-between"
        //justifyContent="flex-end"
      >
        <Text fontSize="2xl" fontFamily="Serif">
          BrightStar
        </Text>
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={onOpen}
          icon={<HamburgerIcon />}
          variant="outline"
        />
        <Drawer placement="right" onClose={onClose} isOpen={isOpen} size="full">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody mt="70px">
              <VStack spacing="4">
                <NavBarButton link="/" text="Home" />
                {isAuth ? (
                  <NavBarButton onClick={handleSignOut} link="/" text="Sign Out" />
                ) : (
                  <>
                    <NavBarButton link="/login" text="Sign In" />
                    <NavBarButton link="/register" text="Sign Up" />
                  </>
                )}

                <ThemeToggler />
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <Flex
          display={{ base: "none", md: "flex" }}
          justify="center"
          alignItems="center"
          ml="auto"
          mr="auto"
        >
          <NavBarButton link="/" text="Home" />
          {isAuth ? (
            <NavBarButton onClick={handleSignOut} link="/" text="Sign Out" />
          ) : (
            // If the user is not authenticated, display the "Sign In" and "Sign Up" buttons
            <>
              <NavBarButton link="/login" text="Sign In" />
              <NavBarButton link="/register" text="Sign Up" />
            </>
          )}
          <ThemeToggler />
        </Flex>
      </Flex>
      <Divider />
        <Toaster />
    </Box>
  );
};

export default Navbar;
