import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { getInitialPreloadedQuery, getRelayProps } from 'relay-nextjs/app';
import { getClientEnvironment } from '../lib/relay_client_environment';


const clientEnv = getClientEnvironment();
const initialPreloadedQuery = getInitialPreloadedQuery({
  createClientEnvironment: () => getClientEnvironment(),
});

function ExampleApp({ Component, pageProps }) {
  const relayProps = getRelayProps(pageProps, initialPreloadedQuery);
  const env = relayProps.preloadedQuery?.environment ?? clientEnv;

  return (
    <RelayEnvironmentProvider environment={env}>
      <Component {...pageProps} {...relayProps} />
    </RelayEnvironmentProvider>
  );
}

export default ExampleApp;