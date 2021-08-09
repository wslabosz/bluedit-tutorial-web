import { NavBar } from '../components/NavBar'
import { usePostsQuery } from '../generated/graphql'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'

const Index = () => {
   const [{ data }] = usePostsQuery()
   return (
      <>
         <NavBar />
         {!data ? (
            <div>loading...</div>
         ) : (
            data.posts.map((p) => <div key={p.id}>{p.title}</div>)
         )}
      </>
   )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
