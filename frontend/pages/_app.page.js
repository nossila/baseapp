import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { getInitialPreloadedQuery, getRelayProps } from 'relay-nextjs/app';
import { getClientEnvironment } from '../lib/relay_client_environment';
import Link from 'next/link'
import './timeline.css'

const clientEnv = getClientEnvironment();
const initialPreloadedQuery = getInitialPreloadedQuery({
  createClientEnvironment: () => getClientEnvironment(),
});

function ExampleApp({ Component, pageProps }) {
  const relayProps = getRelayProps(pageProps, initialPreloadedQuery);
  const env = relayProps.preloadedQuery?.environment ?? clientEnv;

  return (
    <RelayEnvironmentProvider environment={env}>
      <Link href="/">Home</Link>
      { ' | ' }
      <Link href="/pages/create">Create page</Link>
      { ' | ' }
      <Link href="/timeline">Timeline</Link>
      <Component {...pageProps} {...relayProps} />
    </RelayEnvironmentProvider>
  );
}

export default ExampleApp;