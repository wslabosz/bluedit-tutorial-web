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
   const [, vote] = useVoteMutation()
   return (
      <Box d="flex" flexDirection="column" mr={3} ml={-2} alignItems="center">
         <IconButton
            onClick={async () => {
               if (post.voteStatus === 1) {
                  return
               }
               setLoadingState('upvote-loading')
               await vote({
                  postId: post.id,
                  value: 1,
               })
               setLoadingState('not-loading')
            }}
            colorScheme={post.voteStatus === 1 ? 'green' : undefined}
            isLoading={loadingState === 'upvote-loading'}
            aria-label="upvote-post"
            icon={<ChevronUpIcon />}
            size="xs"
         />
         <Text fontSize="normal">{post.points}</Text>
         <IconButton
            onClick={async () => {
               if (post.voteStatus === -1) {
                  return
               }
               setLoadingState('downvote-loading')
               await vote({
                  postId: post.id,
                  value: -1,
               })
               setLoadingState('not-loading')
            }}
            colorScheme={post.voteStatus === -1 ? 'red' : undefined}
            isLoading={loadingState === 'downvote-loading'}
            aria-label="downvote-post"
            icon={<ChevronDownIcon />}
            size="xs"
         />
      </Box>
   )
}
