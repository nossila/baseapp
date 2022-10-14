import { getRelaySerializedState } from 'relay-nextjs';
import { Environment, Network, Store, RecordSource } from 'relay-runtime';

export function createClientNetwork() {
  return Network.create(async (params, variables) => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_RELAY_ENDPOINT,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: params.text,
          variables,
        }),
      }
    );

    return await response.json();
  });
}

let clientEnv;
export function getClientEnvironment() {
  if (typeof window === 'undefined') return null;

  if (clientEnv == null) {
    clientEnv = new Environment({
      network: createClientNetwork(),
      store: new Store(new RecordSource(getRelaySerializedState()?.records)),
      isServer: false,
    });
  }

  return clientEnv;
}
