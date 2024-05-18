import {prodTestUrl} from "../../utils/utils";
export default function SSG({data}) {

  return <>
    <h1>这是静态生成的页面</h1>
    {data.text}
  </>
}

export async function getStaticProps(context) {
  // 调用外部 API 获取数据
  const res = await fetch(prodTestUrl)
  const data = await res.json()

  // 返回的数据将作为 props 传递给页面组件
  return {
    props: { data },
  }
}
