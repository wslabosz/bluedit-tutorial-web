import { ApolloCache } from '@apollo/client'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Box, IconButton, Text } from '@chakra-ui/react'
import gql from 'graphql-tag'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import {
   PostSnippetFragment,
   useMeQuery,
   useVoteMutation,
   VoteMutation,
} from '../generated/graphql'
import { isServer } from '../utils/isServer'

interface UpvoteSectionProps {
   post: PostSnippetFragment
}

const updateAfterVote = (
   value: number,
   postId: number,
   cache: ApolloCache<VoteMutation>
) => {
   const data = cache.readFragment<{
      id: number
      points: number
      voteStatus: number | null
   }>({
      id: 'Post:' + postId,
      fragment: gql`
         fragment _ on Post {
            id
            points
            voteStatus
         }
      `,
   })

   if (data) {
      if (data.voteStatus === value) {
         return
      }
      const newPoints =
         (data.points as number) + (!data.voteStatus ? 1 : 2) * value
      cache.writeFragment({
         id: 'Post:' + postId,
         fragment: gql`
            fragment __ on Post {
               points
               voteStatus
            }
         `,
         data: { points: newPoints, voteStatus: value },
      })
   }
}

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
   const [loadingState, setLoadingState] = useState<
      'upvote-loading' | 'downvote-loading' | 'not-loading'
   >('not-loading')
   const [vote] = useVoteMutation()
   const router = useRouter()
   const { data } = useMeQuery({
      skip: isServer(),
   })

   const voting = async (voteStatus: number, loadingState: any) => {
      // user not logged in
      if (!data?.me) {
         router.replace('/login?next=' + router.pathname)
         // user is logged in
      } else {
         if (post.voteStatus === voteStatus) {
            return
         }
         setLoadingState(loadingState)
         await vote({
            variables: {
               postId: post.id,
               value: voteStatus,
            },
            update: (cache) => updateAfterVote(voteStatus, post.id, cache),
         })
         setLoadingState('not-loading')
      }
   }

   return (
      <Box d="flex" flexDirection="column" mr={3} ml={-2} alignItems="center">
         <IconButton
            onClick={async () => {
               voting(1, 'upvote-loading')
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
               voting(-1, 'downvote-loading')
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
