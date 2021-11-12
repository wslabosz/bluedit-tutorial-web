import React from 'react'
import { Form, Formik } from 'formik'
import { Layout } from '../../../components/Layout'
import { InputField } from '../../../components/InputField'
import { Box, Button } from '@chakra-ui/react'
import { usePostQuery, useUpdatePostMutation } from '../../../generated/graphql'
import useGetIntId from '../../../utils/useGetIntId'
import { useRouter } from 'next/router'

const EditPost = ({}) => {
   const router = useRouter()
   const intId = useGetIntId()
   const { data, loading } = usePostQuery({
      skip: intId === -1,
      variables: {
         id: intId,
      },
   })
   const [updatePost] = useUpdatePostMutation()
   if (loading) {
      return (
         <Layout>
            <div>loading...</div>
         </Layout>
      )
   }
   if (!data?.post) {
      return (
         <Layout>
            <Box>could not find the post</Box>
         </Layout>
      )
   }

   return (
      <Layout variant="small">
         <Formik
            initialValues={{ title: data.post.title, text: data.post.text }}
            onSubmit={async (values) => {
               await updatePost({ variables: { id: intId, ...values } })
               router.back()
            }}
         >
            {({ isSubmitting }) => (
               <Form>
                  <InputField name="title" placeholder="title" label="Title" />
                  <Box mt={4}>
                     <InputField
                        textarea
                        name="text"
                        placeholder="text..."
                        label="Body"
                     />
                  </Box>
                  <Button
                     mt={4}
                     type="submit"
                     isLoading={isSubmitting}
                     backgroundColor="teal"
                  >
                     update post
                  </Button>
               </Form>
            )}
         </Formik>
      </Layout>
   )
}

export default EditPost
