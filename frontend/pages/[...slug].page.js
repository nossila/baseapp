import Head from 'next/head'
import { getClientEnvironment } from '../lib/relay_client_environment';
import { usePageDeleteMutation } from './pages/delete.mutation'
import { withRelay } from 'relay-nextjs';
import { graphql, usePreloadedQuery } from 'react-relay';
import Link from 'next/link'
import { useRouter} from 'next/router'

const PageQuery = graphql`
  query pagesPageQuery($slug: String!) {
    viewer {
      allPages(url: $slug, first: 1) {
        edges {
          node {
            id
            title
            revisions(last: 1) {
              totalCount
              edges {
                node {
                  id
                  type
                  createdAt
                }
              }
            }
          }
        }
      }
    }
  }
`

const Page = ({preloadedQuery}) => {
  const query = usePreloadedQuery(PageQuery, preloadedQuery)
  const page = query.viewer?.allPages?.edges?.[0]?.node
  const [commit] = usePageDeleteMutation()

  const router = useRouter()
  
  if (!page) {
    return <div>not found</div>
  }

  return <div>
    <Head>
      <title>{page.title}</title>
    </Head>
    <h1>{page.title}</h1>
    <div>Edit: <Link href={`/pages/update/${page.id}`}>Edit page</Link></div>
    <div>Changes: {page.revisions.totalCount}</div>
    <div>Delete: <button onClick={() => commit({
        variables: {
          input: {
            id: page.id,
          },
        },
        onCompleted(data) {
          // router.push('/')
        },
      })}>Delete</button></div>
  </div>
}

export default withRelay(Page, PageQuery, {
  createClientEnvironment: () => getClientEnvironment(),
  variablesFromContext: (ctx) => ({slug: ctx.query.slug.join('/')}),
  createServerEnvironment: async () => {
    const { createServerEnvironment } = await import(
      '../lib/server/relay_server_environment'
    );

    return createServerEnvironment();
  },
});
