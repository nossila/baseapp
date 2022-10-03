import Link from 'next/link'
import { graphql } from 'react-relay'
import { getRelayStaticProps } from '../lib/relay'
import Pages from '../components/Pages'

const Index = ({ viewer }) => (
  <div>
    <Link href="/about">
      <a>About</a>
    </Link>
    <Pages viewer={viewer} />
  </div>
)

const query = graphql`
  query pagesIndexQuery {
    viewer {
      ...Pages_viewer
    }
  }
`

export async function getStaticProps() {
  return getRelayStaticProps(query)
}

export default Index
