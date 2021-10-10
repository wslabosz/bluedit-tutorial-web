import React from 'react'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../../utils/createUrqlClient'
import { Layout } from '../../components/Layout'
import { Box, Heading } from '@chakra-ui/react'
import useGetPostFromUrl from '../../utils/useGetPostFromUrl'
import EditDeletePostButtons from '../../components/EditDeletePostButtons'

const Post = ({}) => {
   const [{ data, error, fetching }] = useGetPostFromUrl()
   if (fetching) {
      return (
         <Layout>
            <div>loading...</div>
         </Layout>
      )
   }
   if (error) {
      return <div>{error.message}</div>
   }

   if (!data?.post) {
      return (
         <Layout>
            <Box>could not find the post</Box>
         </Layout>
      )
   }

   return (
      <Layout>
         <Heading mb={4}>{data?.post?.title}</Heading>
         <Box mb={4}>{data?.post?.text}</Box>
         {/*NOTE: TO FIX DATA NOT HAVING CREATOR_ID*/}
         <EditDeletePostButtons id={data.post.id} creatorId={data.post.id} />
      </Layout>
   )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Post)
