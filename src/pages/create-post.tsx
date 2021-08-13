import React, { useEffect } from 'react'
import { Box, Button } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { InputField } from '../components/InputField'
import { useCreatePostMutation, useMeQuery } from '../generated/graphql'
import { useRouter } from 'next/router'
import { createUrqlClient } from '../utils/createUrqlClient'
import { withUrqlClient } from 'next-urql'
import { Layout } from '../components/Layout'

const CreatePost: React.FC<{}> = ({}) => {
   const [{ data, fetching }] = useMeQuery()
   const router = useRouter()
   useEffect(() => {
      if (!fetching && !data?.me) {
         router.replace('/login')
      }
   }, [fetching, data, router])
   const [, createPost] = useCreatePostMutation()
   return (
      <Layout variant="small">
         <Formik
            initialValues={{ title: '', text: '' }}
            onSubmit={async (values) => {
               const { error } = await createPost({ input: values })
               if (!error) {
                  router.push('/')
               }
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
                     post
                  </Button>
               </Form>
            )}
         </Formik>
      </Layout>
   )
}

export default withUrqlClient(createUrqlClient)(CreatePost)