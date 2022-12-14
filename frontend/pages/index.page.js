import { getClientEnvironment } from '../lib/relay_client_environment';
import { withRelay } from 'relay-nextjs';
import { graphql, usePreloadedQuery } from 'react-relay';
import Pages from '../components/Pages'

const IndexQuery = graphql`
  query pagesIndexQuery {
    viewer {
      ...Pages_viewer
    }
  }
`

const Index = ({preloadedQuery}) => {
  const query = usePreloadedQuery(IndexQuery, preloadedQuery);
  return <div>
    <Pages viewer={query.viewer} />
  </div>
}


export default withRelay(Index, IndexQuery, {
  createClientEnvironment: () => getClientEnvironment(),
  createServerEnvironment: async () => {
    const { createServerEnvironment } = await import(
      '../lib/server/relay_server_environment'
    );

    return createServerEnvironment();
  },
});
