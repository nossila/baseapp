import { graphql, useMutation, useRelayEnvironment } from "react-relay";

const mutation = graphql`
  mutation createPageMutation($input: PageCreateInput!) {
    pageCreate(input: $input) {
      page {
        id
        title
        url
      }
    }
  }
`;

export function usePageCreateMutation() {
  const environment = useRelayEnvironment()
  return useMutation(mutation)
}

