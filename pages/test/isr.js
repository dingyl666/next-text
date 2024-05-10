import {prodTestUrl} from "../../utils/utils";


export async function getStaticProps() {
  // 调用外部 API 获取数据
  const res = await fetch(prodTestUrl)
  const data = await res.json()

  // 返回的数据将作为 props 传递给页面组件
  return {
    props: {
      data,
    },
    revalidate: 10, // 在 10 秒后重新生成页面},
  }
}
  export default function ISR({data}) {
    return (
      <>
        <h1>这是增量静态生成的页面-10s更新一次</h1>
        {data.text}
      </>
    )
  }
