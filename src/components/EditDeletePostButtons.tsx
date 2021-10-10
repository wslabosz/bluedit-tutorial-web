import React from 'react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Box, IconButton, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useDeletePostMutation, useMeQuery } from '../generated/graphql'

interface EditDeletePostButtons {
   id: number
   creatorId: number
}

const EditDeletePostButtons: React.FC<EditDeletePostButtons> = ({
   id,
   creatorId,
}) => {
   const [{ data: meData }] = useMeQuery()
   const [, deletePost] = useDeletePostMutation()

   if (meData?.me?.id !== creatorId) {
      return null
   }

   return (
      <Box>
         <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
            <IconButton
               as={Link}
               w={8}
               h={8}
               mr={3}
               icon={<EditIcon />}
               aria-label="Update Post"
            />
         </NextLink>
         <IconButton
            w={8}
            h={8}
            icon={<DeleteIcon />}
            aria-label="Delete Post"
            onClick={() => {
               deletePost({ id })
            }}
         />
      </Box>
   )
}

export default EditDeletePostButtons
