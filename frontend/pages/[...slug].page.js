import Link from 'next/link'
import Head from 'next/head'
import { graphql } from 'react-relay'
import { getRelayStaticProps } from '../lib/relay'

const Page = ({ viewer }) => {
  const page = viewer?.allPages?.edges?.[0]?.node
  
  if (!page) {
    return <div>not found</div>
  }

  return <div>
    <Head>
      <title>{page.title}</title>
    </Head>
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
  return getRelayStaticProps(query, {url: context.params.slug.join('/')})
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking' // enables static page to be generated on demand
  }
}

export default Page
