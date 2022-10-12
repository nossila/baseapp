import { graphql, useMutation } from "react-relay";
import { useEnvironment } from '../../lib/relay'

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
  const environment = useEnvironment()
  return useMutation(mutation)
}

