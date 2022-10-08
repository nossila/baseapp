import { useMemo } from 'react'
import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import { fetchQuery } from 'react-relay'

let relayEnvironment

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise
function networkFetchQuery(endpoint) {
  return (operation, variables, cacheConfig, uploadables) => {
    return fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, // Add authentication and other headers here
      body: JSON.stringify({
        query: operation.text, // GraphQL text from input
        variables,
      }),
    }).then((response) => response.json())
  }
}

function createEnvironment(initialRecords, endpoint) {
  return new Environment({
    // Create a network layer from the fetch function
    network: Network.create(networkFetchQuery(endpoint)),
    store: new Store(new RecordSource()),
  })
}

export function initEnvironment(initialRecords, endpoint) {
  // Create a network layer from the fetch function
  const environment = relayEnvironment ?? createEnvironment(initialRecords, endpoint)

  // If your page has Next.js data fetching methods that use Relay, the initial records
  // will get hydrated here
  if (initialRecords) {
    environment.getStore().publish(new RecordSource(initialRecords))
  }
  // For SSG and SSR always create a new Relay environment
  if (typeof window === 'undefined') return environment
  // Create the Relay environment once in the client
  if (!relayEnvironment) relayEnvironment = environment

  return relayEnvironment
}

export function useEnvironment(initialRecords) {
  const store = useMemo(() => initEnvironment(initialRecords, process.env.NEXT_PUBLIC_RELAY_ENDPOINT), [initialRecords])
  return store
}

export async function getRelayStaticProps(query, variables, options) {
const environment = initEnvironment(undefined, process.env.RELAY_ENDPOINT)
  const queryProps = await fetchQuery(environment, query, variables, options)
  const initialRecords = environment.getStore().getSource().toJSON()

  return {
    props: {
      ...queryProps,
      initialRecords,
    },
  }
}
