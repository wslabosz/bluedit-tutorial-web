import { usePostsQuery } from '../generated/graphql'
import { Layout } from '../components/Layout'
import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'
import { UpvoteSection } from '../components/UpvoteSection'
import EditDeletePostButtons from '../components/EditDeletePostButtons'
import { withApollo } from '../utils/withApollo'

const Index = () => {
   const { data, error, loading, fetchMore, variables } = usePostsQuery({
      variables: {
         limit: 10,
         cursor: null as string | null,
      },
      notifyOnNetworkStatusChange: true,
   })

   if (!loading && !data) {
      return (
         <div>
            <div>TBD (query failed, no data fetched)</div>
            <div>{error?.message}</div>
         </div>
      )
   }

   return (
      <Layout>
         {loading && !data ? (
            <div>loading...</div>
         ) : (
            <Stack spacing={8}>
               {data!.posts.posts.map((p) =>
                  !p ? null : (
                     <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                        <UpvoteSection post={p} />
                        <Box flex={1}>
                           <Text fontSize="small">
                              posted by {p.creator.username}
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
                              <EditDeletePostButtons
                                 id={p.id}
                                 creatorId={p.creator.id}
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
                     fetchMore({
                        variables: {
                           limit: variables!.limit,
                           cursor:
                              data.posts.posts[data.posts.posts.length - 1]
                                 .createdAt,
                        },
                     })
                  }}
                  isLoading={loading}
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

export default withApollo({ ssr: true })(Index)
