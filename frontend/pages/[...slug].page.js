import Head from 'next/head'
import { getClientEnvironment } from '../lib/relay_client_environment';
import { withRelay } from 'relay-nextjs';
import { graphql, usePreloadedQuery } from 'react-relay';

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
  const query = usePreloadedQuery(PageQuery, preloadedQuery);
  const page = query.viewer?.allPages?.edges?.[0]?.node
  
  if (!page) {
    return <div>not found</div>
  }

  return <div>
    <Head>
      <title>{page.title}</title>
    </Head>
    <h1>{page.title}</h1>
    <div>Changes: {page.revisions.totalCount}</div>
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
