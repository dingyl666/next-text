import {prodTestUrl} from "../../utils/utils";


export default function SSR({data}) {
  return <>
    <h1>这是服务端渲染的页面</h1>
    {data.text}
  </>
}

export async function getServerSideProps(context) {
  const res = await fetch(prodTestUrl);
  const data = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data }, // will be passed to the page component as props
  };
}
