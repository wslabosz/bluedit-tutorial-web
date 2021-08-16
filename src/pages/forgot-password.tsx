import React, { useState } from 'react'
import { Box, Button } from '@chakra-ui/react'
import { useForgotPasswordMutation } from '../generated/graphql'
import { Form, Formik } from 'formik'
import { InputField } from '../components/InputField'
import { Wrapper } from '../components/Wrapper'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'

export const ForgotPassword: React.FC<{}> = ({}) => {
   const [complete, setComplete] = useState(false)
   const [, forgotPassword] = useForgotPasswordMutation()
   return (
      <Wrapper variant="small">
         <Formik
            initialValues={{ email: '' }}
            onSubmit={async (values) => {
               await forgotPassword(values)
               setComplete(true)
            }}
         >
            {({ isSubmitting }) =>
               complete ? (
                  <Box>Check your mail inbox for a message!</Box>
               ) : (
                  <Form>
                     <InputField
                        name="email"
                        placeholder="email"
                        label="Email"
                        type="email"
                     />
                     <Button
                        mt={4}
                        type="submit"
                        isLoading={isSubmitting}
                        backgroundColor="teal"
                     >
                        send link
                     </Button>
                  </Form>
               )
            }
         </Formik>
      </Wrapper>
   )
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)
