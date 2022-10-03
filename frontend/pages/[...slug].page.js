import Link from 'next/link'
// import { useRouter } from 'next/router'
import { graphql } from 'react-relay'
import { getRelayStaticProps } from '../lib/relay'

const Page = ({ viewer }) => {
  const page = viewer?.allPages?.edges?.[0]?.node

  console.log('viewer', viewer)
  console.log('page', page?.id)
  
  if (!page) {
    return <div>not found</div>
  }

  return <div>
    <h1>{page.title}</h1>
    <div>Changes: {page.revisions.totalCount}</div>
  </div>
}

const query = graphql`
  query pagesPageQuery($url: String!) {
    viewer {
      allPages(url: $url, first: 1) {
        edges {
          node {
            id
            title
            revisions(last: 1) {
              totalCount
              edges {
                node {
                  id
                  type
                  createdAt
                }
              }
            }
          }
        }
      }
    }
  }
`

export async function getStaticProps(context) {
  console.log('context', context)
  return getRelayStaticProps(query, {url: context.params.slug.join('/')})
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking' // enables static page to be generated on demand
  }
}

export default Page
