import Head from 'next/head'
import { usePageCreateMutation } from './create.mutation'
import { useForm } from "react-hook-form";

const PageCreate = (props) => {
  const mutation = usePageCreateMutation()

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = data => {
    mutation.commit(
      {
        title: data.title,
        body: data.body,
      },
      {
        onSuccess: () => {},
        onError: () => {},
      }
    )
  };

  return <div>
    <Head>
      <title>Create page</title>
    </Head>
    <h1>Create page</h1>
    <form onSubmit={handleSubmit(onSubmit)}>
      <p>
        <label>Title 
          <input type="text" {...register("title")} /></label>
      </p>
      <p>
        <label>Body <textarea {...register("body")} /></label>
      </p>
      <button type="submit">Save</button>
    </form>
  </div>
}

export default PageCreate
