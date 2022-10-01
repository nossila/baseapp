import { createFragmentContainer, graphql } from 'react-relay'
import PagePreview from './PagePreview'

const Pages = ({ viewer }) => {
  return <div>
    <h1>Pages</h1>
    <ul>
      {viewer.allPages.edges.map(({ node }) => (
        <PagePreview key={node.id} page={node} />
      ))}
    </ul>
  </div>
}

export default createFragmentContainer(Pages, {
  viewer: graphql`
    fragment Pages_viewer on Query {
      allPages(first: 10) {
        edges {
          node {
            ...PagePreview_post
            id
          }
        }
      }
    }
  `,
})
