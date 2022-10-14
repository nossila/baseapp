import { graphql, useMutation, useRelayEnvironment } from "react-relay";

const mutation = graphql`
  mutation updatePageMutation($input: PageUpdateInput!) {
    pageUpdate(input: $input) {
      page {
        id
        title
        body
        url
      }
    }
  }
`;

export function usePageUpdateMutation() {
  const environment = useRelayEnvironment()
  return useMutation(mutation)
}