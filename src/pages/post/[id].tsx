import React from 'react'
import { Layout } from '../../components/Layout'
import { Box, Heading } from '@chakra-ui/react'
import useGetPostFromUrl from '../../utils/useGetPostFromUrl'
import EditDeletePostButtons from '../../components/EditDeletePostButtons'

const Post = ({}) => {
   const { data, error, loading } = useGetPostFromUrl()
   if (loading) {
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
         <EditDeletePostButtons id={data.post.id} creatorId={data.post.id} />
      </Layout>
   )
}

export default Post
