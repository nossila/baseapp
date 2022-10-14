import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getClientEnvironment } from '../lib/relay_client_environment';
import { withRelay } from 'relay-nextjs';
import { graphql, usePreloadedQuery } from 'react-relay';

const AllRevisionsQuery = graphql`
  query timelineQuery {
    viewer {
      allRevisions(orderBy: "-created_at") {
        edges {
          node {
            id
            typeDisplay
            createdAt
            contentObject {
              __typename
              ... on Page {
                id
                title
                body
                url
              }
            }
          }
        }
      }
    }
  }
`;

function TimeLineBlock({ data, direction }) {
  return (
    <div className={`container ${direction}`}>
      <article className="content">
        <div className="row">
          <Link href={data.contentObject.url}>
            <a className="content-title">
              {data.contentObject.__typename || "Page"} {data.contentObject?.id}
            </a>
          </Link>
          <div>
            <p className="content-type">
              Type: <b>{data.typeDisplay}</b>
            </p>
            <p>{formatDistanceToNow(new Date(data.createdAt))} ago</p>
          </div>
        </div>
        <p>Title: {data.contentObject?.title}</p>
        <p className="content-body">Body: {data.contentObject?.body}</p>
        <p>URL: {data.contentObject?.url}</p>
        <p className="content-change-number">
          Author: <b>Anonymous</b>
        </p>
        <p className="content-change-number" style={{ marginTop: 4 }}>
          Change ID: <b>{data.id}</b>
        </p>
      </article>
    </div>
  );
}

function TimeLine({preloadedQuery}) {
  const query = usePreloadedQuery(AllRevisionsQuery, preloadedQuery);
  const revisions = query?.viewer?.allRevisions?.edges?.filter(
    ({ node: revision }) => revision.contentObject
  );

  return (
    <div className="timeline">
      <h1 className="title">Changes History</h1>
      {revisions.map(({ node: revision }) => (
        <TimeLineBlock
          data={revision}
          direction={"right"}
          key={revision.contentObject.id}
        />
      ))}
    </div>
  );
}

export default withRelay(TimeLine, AllRevisionsQuery, {
    createClientEnvironment: () => getClientEnvironment(),
    createServerEnvironment: async () => {
      const { createServerEnvironment } = await import(
        '../lib/server/relay_server_environment'
      );
  
      return createServerEnvironment();
    },
  });