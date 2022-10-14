import { graphql, useMutation, useRelayEnvironment } from "react-relay";

const mutation = graphql`
  mutation deletePageMutation($input: PageDeleteInput!) {
    pageDelete(input: $input) {
      deletedID
    }
  }
`;

export function usePageDeleteMutation() {
  const environment = useRelayEnvironment()
  return useMutation(mutation)
}