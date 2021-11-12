import { ChakraProvider, ThemeProvider } from '@chakra-ui/react'
import theme from '../theme'


function MyApp({ Component, pageProps }: any) {
   return (
         <ThemeProvider theme={theme}>
            <ChakraProvider resetCSS theme={theme}>
               <Component {...pageProps} />
            </ChakraProvider>
         </ThemeProvider>
   )
}

export default MyApp
