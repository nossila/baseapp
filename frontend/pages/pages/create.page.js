import Head from 'next/head'
// import { usePageCreateMutation } from './create.mutation'

const PageCreate = (props) => {
  // const mutation = usePageCreateMutation()
  // console.log(mutation)

  return <div>
    <Head>
      <title>Create page</title>
    </Head>
    <h1>Create page</h1>
    <form>
      <p><label>Title <input type="text" /></label></p>
      <p><label>Body <textarea /></label></p>
      <button type="submit">Save</button>
    </form>
  </div>
}

export default PageCreate
