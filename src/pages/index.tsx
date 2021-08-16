import { usePostsQuery } from '../generated/graphql'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { Layout } from '../components/Layout'
import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import React, { useState } from 'react'

const Index = () => {
   const [variables, setVariables] = useState({
      limit: 10,
      cursor: null as string | null,
   })
   const [{ data, fetching }] = usePostsQuery({
      variables,
   })
   if (!fetching && !data) {
      return <div>TBD (query failed, no data fetched)</div>
   }

   return (
      <Layout>
         <Flex align="center">
            <Heading>Reddit Wannabe</Heading>
            <NextLink href="/create-post">
               <Link ml="auto">create post</Link>
            </NextLink>
         </Flex>
         <br />
         {fetching && !data ? (
            <div>loading...</div>
         ) : (
            <Stack spacing={8}>
               {data!.posts.map((p) => (
                  <Box key={p.id} p={5} shadow="md" borderWidth="1px">
                     <Heading fontSize="xl">{p.title}</Heading>
                     <Text mt={4}>{p.textSnippet}</Text>
                  </Box>
               ))}
            </Stack>
         )}
         {data ? (
            <Flex>
               <Button
                  onClick={() => {
                     setVariables({
                        limit: variables.limit,
                        cursor: data.posts[data.posts.length - 1].createdAt,
                     })
                  }}
                  isLoading={fetching}
                  m="auto"
                  my={9}
               >
                  load more posts
               </Button>
            </Flex>
         ) : null}
      </Layout>
   )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
