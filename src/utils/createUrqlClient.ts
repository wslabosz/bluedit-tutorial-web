import {
   dedupExchange,
   fetchExchange,
   Exchange,
   stringifyVariables,
} from 'urql'
import { pipe, tap } from 'wonka'
import { cacheExchange, Resolver } from '@urql/exchange-graphcache'
import {
   LoginMutation,
   MeDocument,
   MeQuery,
   RegisterMutation,
   LogoutMutation,
} from '../generated/graphql'
import { betterUpdateQuery } from './betterUpdateQuery'
import Router from 'next/router'

const errorExchange: Exchange =
   ({ forward }) =>
   (ops$) => {
      return pipe(
         forward(ops$),
         tap(({ error }) => {
            if (error?.message.includes('not authenticated')) {
               Router.replace('/login')
            }
         })
      )
   }

export const createUrqlClient = (ssrExchange: any) => ({
   url: 'http://localhost:4000/graphql',
   fetchOptions: {
      credentials: 'include' as const,
   },
   exchanges: [
      dedupExchange,
      cacheExchange({
         resolvers: {
            Query: {
               posts: cursorPagination(),
            },
         },
         updates: {
            Mutation: {
               logout: (_result, args, cache, info) => {
                  betterUpdateQuery<LogoutMutation, MeQuery>(
                     cache,
                     { query: MeDocument },
                     _result,
                     () => ({ me: null })
                  )
               },

               login: (_result, args, cache, info) => {
                  betterUpdateQuery<LoginMutation, MeQuery>(
                     cache,
                     { query: MeDocument },
                     _result,
                     (result, query) => {
                        if (result.login.errors) {
                           return query
                        } else {
                           return {
                              me: result.login.user,
                           }
                        }
                     }
                  )
               },

               register: (_result, args, cache, info) => {
                  betterUpdateQuery<RegisterMutation, MeQuery>(
                     cache,
                     { query: MeDocument },
                     _result,
                     (result, query) => {
                        if (result.register.errors) {
                           return query
                        } else {
                           return {
                              me: result.register.user,
                           }
                        }
                     }
                  )
               },
            },
         },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
   ],
})

export const cursorPagination = (): Resolver => {
   return (_parent, fieldArgs, cache, info) => {
      const { parentKey: entityKey, fieldName } = info

      const allFields = cache.inspectFields(entityKey)
      const fieldInfos = allFields.filter(
         (info) => info.fieldName === fieldName
      )
      const size = fieldInfos.length
      if (size === 0) {
         return undefined
      }

      const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`
      const isItInTheCache = cache.resolve(
         cache.resolve(entityKey, fieldKey) as string,
         'posts'
      )
      info.partial = !isItInTheCache

      console.log(isItInTheCache)
      const results: string[] = []
      fieldInfos.forEach((field) => {
         const data = cache.resolve(entityKey, field.fieldKey) as string[]
         results.push(...data)
      })
      return results
   }
}
