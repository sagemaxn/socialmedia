import { useState, useEffect } from "react";
import { Flex, Button } from "@chakra-ui/react";
import { decode, verify } from "jsonwebtoken";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { SettingsIcon } from '@chakra-ui/icons'
import { useRouter } from "next/router";
import { useLogoutMutation } from "../generated/graphql";
import ChangeAvatar from '../components/ChangeAvatar'
// import { useAuthQuery } from "../generated/graphql";

import auth from "../lib/auth";
import {compose} from '../lib/compose'

function Navbar({decoded}) {
  const { onOpen, isOpen, onClose } = useDisclosure()
  const [logout, { data }] = useLogoutMutation();
  const Router = useRouter();
  if(Router.pathname === '/login'){
    return null
  }

  return (
    <>
    <Flex
      direction="row-reverse"
      as="nav"
      align="center"
      justify="end"
      wrap="wrap"
      color="black"
      borderBottom="1px"
      height="50px"
      width={{base: "100%", md: "xl"}}
    >
      
      <Menu>
        <MenuButton as={Text}>
          {decoded ? decoded.user : null}
          <SettingsIcon/>
        </MenuButton>
        <MenuList>
        <MenuItem onClick={onOpen}>
          Change Avatar
          </MenuItem>
          <MenuItem
            onClick={async () => {
              logout();
            }}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
    <ChangeAvatar onClose={onClose} isOpen={isOpen}/>
    </>
  );
}

export const getServerSideProps = compose(auth)

export default Navbar;
