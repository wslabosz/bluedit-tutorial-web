import React, { useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { Box, Button, Link, Flex } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { InputField } from '../../components/InputField'
import { Wrapper } from '../../components/Wrapper'
import { toErrorMap } from '../../utils/toErrorMap'
import { useChangePasswordMutation } from '../../generated/graphql'

const ChangePassword: NextPage = () => {
   const router = useRouter()
   const [changePassword] = useChangePasswordMutation()
   const [tokenError, setTokenError] = useState('')
   return (
      <Wrapper variant="small">
         <Formik
            initialValues={{ newPassword: '' }}
            onSubmit={async (values, { setErrors }) => {
               const response = await changePassword({
                  variables: {
                     token:
                        typeof router.query.token === 'string'
                           ? router.query.token
                           : '',
                     newPassword: values.newPassword,
                  },
               })
               if (response.data?.changePassword.errors) {
                  const errorMap = toErrorMap(
                     response.data.changePassword.errors
                  )
                  if ('token' in errorMap) {
                     setTokenError(errorMap.token)
                  }
                  setErrors(errorMap)
               } else if (response.data?.changePassword.user) {
                  // worked
                  router.push('/')
               }
            }}
         >
            {({ isSubmitting }) => (
               <Form>
                  <InputField
                     name="newPassword"
                     placeholder="new password"
                     label="New Password"
                     type="password"
                  />
                  {tokenError ? (
                     <Flex>
                        <Box mr={2} color="red">
                           {tokenError}
                        </Box>
                        <NextLink href="/forgot-password">
                           <Link>I want to reset password once more</Link>
                        </NextLink>
                     </Flex>
                  ) : null}
                  <Button
                     mt={4}
                     type="submit"
                     isLoading={isSubmitting}
                     backgroundColor="teal"
                  >
                     change password
                  </Button>
               </Form>
            )}
         </Formik>
      </Wrapper>
   )
}

export default ChangePassword
