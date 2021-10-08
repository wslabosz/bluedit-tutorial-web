import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Box, IconButton, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql'

interface UpvoteSectionProps {
   post: PostSnippetFragment
}

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
   const [loadingState, setLoadingState] = useState<
      'upvote-loading' | 'downvote-loading' | 'not-loading'
   >('not-loading')
   const [,vote] = useVoteMutation()
   return (
      <Box d="flex" flexDirection="column" mr={3} ml={-2} alignItems="center">
         <IconButton
            onClick={async () => {
               setLoadingState('upvote-loading')
               await vote({
                  postId: post.id,
                  value: 1,
               })
               setLoadingState('not-loading')
            }}
            isLoading={loadingState === 'upvote-loading'}
            aria-label="upvote-post"
            icon={<ChevronUpIcon />}
            size="xs"
         />
         <Text fontSize="normal">{post.points}</Text>
         <IconButton
            onClick={async () => {
               setLoadingState('downvote-loading')
               await vote({
                  postId: post.id,
                  value: -1,
               })
               setLoadingState('not-loading')
            }}
            isLoading={loadingState === 'downvote-loading'}
            aria-label="downvote-post"
            icon={<ChevronDownIcon />}
            size="xs"
         />
      </Box>
   )
}
