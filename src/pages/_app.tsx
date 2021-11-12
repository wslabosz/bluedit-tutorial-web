import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { ChakraProvider, ThemeProvider } from '@chakra-ui/react'
import { PaginatedPosts } from '../generated/graphql'
import theme from '../theme'

const client = new ApolloClient({
   uri: 'http://localhost:4000/graphql',
   credentials: 'include',
   cache: new InMemoryCache({
      typePolicies: {
         Query: {
            fields: {
               posts: {
                  keyArgs: [],
                  merge(
                     existing: PaginatedPosts | undefined,
                     incoming: PaginatedPosts
                  ): PaginatedPosts {
                     return {
                        ...incoming,
                        posts: [...(existing?.posts || []), ...incoming.posts],
                     }
                  },
               },
            },
         },
      },
   }),
})

function MyApp({ Component, pageProps }: any) {
   return (
      <ApolloProvider client={client}>
         <ThemeProvider theme={theme}>
            <ChakraProvider resetCSS theme={theme}>
               <Component {...pageProps} />
            </ChakraProvider>
         </ThemeProvider>
      </ApolloProvider>
   )
}

export default MyApp
