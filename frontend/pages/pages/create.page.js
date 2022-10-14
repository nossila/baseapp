import Head from 'next/head'
import { usePageCreateMutation } from './create.mutation'
import { useForm } from "react-hook-form";
import { useRouter} from 'next/router'

const PageCreate = (props) => {
  const [commit] = usePageCreateMutation()
  const router = useRouter()

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = data => {
    commit({
      variables: {
        input: {
          page: {
            title: data.title,
            body: data.body,
            url: data.url,
          }
        },
      },
      onCompleted(data) {
        router.push(`/${data.pageCreate.page.url}`)
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

export default PageCreate
