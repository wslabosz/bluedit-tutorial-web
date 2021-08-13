import React from 'react'
import { Box, Button, Flex, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useMeQuery, useLogoutMutation } from '../generated/graphql'
import { isServer } from '../utils/isServer'

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
   const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
   const [{ data, fetching }] = useMeQuery({
      pause: isServer(),
   })
   let body = null

   // data is loading
   if (isServer() || fetching) {
      // user not logged in
   } else if (!data?.me) {
      body = (
         <>
            <NextLink href="/login">
               <Link color="white" mr={3}>
                  login
               </Link>
            </NextLink>
            <NextLink href="/register">
               <Link>register</Link>
            </NextLink>
         </>
      )
      // user is logged in
   } else {
      body = (
         <Flex>
            <Box mr={4} fontSize="large">
               {data.me.username}
            </Box>
            <Button
               onClick={() => {
                  logout()
               }}
               isLoading={logoutFetching}
               variant="link"
            >
               logout
            </Button>
         </Flex>
      )
   }

   return (
      <Flex zIndex={1} position="sticky" top={0} bg="#289" p={4}>
         <Box ml="auto">{body}</Box>
      </Flex>
   )
}
