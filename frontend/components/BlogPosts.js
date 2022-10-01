import { createFragmentContainer, graphql } from 'react-relay'
import BlogPostPreview from './BlogPostPreview'

const BlogPosts = ({ viewer }) => {
  return <div>
    <h1>Blog posts</h1>
    <ul>
      {viewer.allPages.edges.map(({ node }) => (
        <BlogPostPreview key={node.id} post={node} />
      ))}
    </ul>
  </div>
}

export default createFragmentContainer(BlogPosts, {
  viewer: graphql`
    fragment BlogPosts_viewer on Query {
      allPages(first: 10) {
        edges {
          node {
            ...BlogPostPreview_post
            id
          }
        }
      }
    }
  `,
})
