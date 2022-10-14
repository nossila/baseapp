import Head from 'next/head'
import { getClientEnvironment } from '../../../lib/relay_client_environment';
import { withRelay } from 'relay-nextjs';
import { usePageUpdateMutation } from './update.mutation'
import { useForm } from "react-hook-form";
import { graphql, usePreloadedQuery } from 'react-relay';
import { useRouter} from 'next/router'

const PageQuery = graphql`
  query IdPageUpdateQuery($id: ID!) {
    page(id: $id) {
      id
      title
      body
      url
    }
  }
`

const PageUpdate = ({preloadedQuery}) => {
  const query = usePreloadedQuery(PageQuery, preloadedQuery);
  const [commit] = usePageUpdateMutation()
  const router = useRouter()
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: query.page,
  });
  const onSubmit = data => {
    commit({
      variables: {
        input: {
          id: router.query.id,
          page: {
            title: data.title,
            body: data.body,
            url: data.url,
          }
        },
      },
      onCompleted(data) {
        router.push(`/${data.pageUpdate.page.url}`)
      },
    })
  };

  return <div>
    <Head>
      <title>Create page</title>
    </Head>
    <h1>Create page</h1>
    <form onSubmit={handleSubmit(onSubmit)}>
      <p>
        <label>Title <br />
        <input type="text" {...register("title", { required: true })} /></label>
        {errors.title && <span><br />This field is required</span>}
      </p>
      <p><label>Body <br />
        <textarea id="body" {...register("body", { required: true })} />
        </label>
      </p>
      <p>
        <label>URL <br />
          <input type="text" {...register("url", { required: true })} /></label>
      </p>
      <button type="submit">Save</button>
    </form>
  </div>
}

export default withRelay(PageUpdate, PageQuery, {
  createClientEnvironment: () => getClientEnvironment(),
  createServerEnvironment: async () => {
    const { createServerEnvironment } = await import(
      '../../../lib/server/relay_server_environment'
    );

    return createServerEnvironment();
  },
});
