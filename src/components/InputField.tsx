import {
   FormControl,
   FormLabel,
   FormErrorMessage,
} from '@chakra-ui/form-control'
import { Input, Textarea } from '@chakra-ui/react'
import { useField } from 'formik'
import React, { InputHTMLAttributes } from 'react'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
   label: string
   name: string
   textarea?: Boolean
}
{
   /* rename unused props to underscore by destructing */
}
export const InputField: React.FC<InputFieldProps> = ({
   label,
   textarea,
   size: _,
   ...props
}) => {
   let InputOrTextarea = Input
   if (textarea) {
      InputOrTextarea = Textarea as any
   }
   const [field, { error }] = useField(props)
   return (
      <FormControl isInvalid={!!error}>
         {' '}
         {/* casting empty string to boolean false */}
         <FormLabel htmlFor={field.name}>{label}</FormLabel>
         <InputOrTextarea {...field} {...props} id={field.name} />
         {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
      </FormControl>
   )
}
