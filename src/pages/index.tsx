import { useDeletePostMutation, usePostsQuery } from '../generated/graphql'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { Layout } from '../components/Layout'
import {
   Box,
   Button,
   Flex,
   Heading,
   IconButton,
   Link,
   Stack,
   Text,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import React, { useState } from 'react'
import { UpvoteSection } from '../components/UpvoteSection'
import { DeleteIcon } from '@chakra-ui/icons'

const Index = () => {
   const [variables, setVariables] = useState({
      limit: 10,
      cursor: null as string | null,
   })
   const [{ data, fetching }] = usePostsQuery({
      variables,
   })
   const [, deletePost] = useDeletePostMutation()
   if (!fetching && !data) {
      return <div>TBD (query failed, no data fetched)</div>
   }

   return (
      <Layout>
         {fetching && !data ? (
            <div>loading...</div>
         ) : (
            <Stack spacing={8}>
               {data!.posts.posts.map((p) =>
                  !p ? null : (
                     <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                        <UpvoteSection post={p} />
                        <Box flex={1}>
                           <Text fontSize="small">
                              posted by {p.createdBy.username}
                           </Text>
                           <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                              <Link>
                                 <Heading fontSize="xl">{p.title}</Heading>
                              </Link>
                           </NextLink>
                           <Flex align="center">
                              <Text flex={1} mt={4}>
                                 {p.textSnippet}
                              </Text>
                              <IconButton
                                 ml="auto"
                                 colorScheme="red"
                                 icon={<DeleteIcon />}
                                 aria-label="Delete Post"
                                 onClick={() => {
                                    deletePost({ id: p.id })
                                 }}
                              />
                           </Flex>
                        </Box>
                     </Flex>
                  )
               )}
            </Stack>
         )}
         {data && data.posts.hasMore ? (
            <Flex>
               <Button
                  onClick={() => {
                     setVariables({
                        limit: variables.limit,
                        cursor:
                           data.posts.posts[data.posts.posts.length - 1]
                              .createdAt,
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
