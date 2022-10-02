import { createFragmentContainer, graphql } from 'react-relay'
import Link from 'next/link'

const PagePreview = ({ page }) => <li><Link href={`/${page.url}`}>{page.title}</Link></li>

export default createFragmentContainer(PagePreview, {
  page: graphql`
    fragment PagePreview_post on Page {
      id
      title
      url
    }
  `,
})
