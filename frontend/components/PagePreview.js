import { createFragmentContainer, graphql } from 'react-relay'

const PagePreview = ({ page }) => <li>{page.title}</li>

export default createFragmentContainer(PagePreview, {
  page: graphql`
    fragment PagePreview_post on Page {
      id
      title
      url
    }
  `,
})
