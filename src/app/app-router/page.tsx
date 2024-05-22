import Link from "next/link";
import {Metadata} from "next";



export const metadata: Metadata = {
  title: '静态元数据',
  description: '自定义元数据',
}

export default async function () {
  return <>
    <p>
      服务端组件直接在客户端组件中使用会自动转变成客户端组件<br/>
      可以已children的形式传递给客户端组件 这样就不会转变成客户端组件了
    </p>
    <Link href={'/app-router/sequential-data'}>顺序获取数据</Link>
    <p></p>
    <Link href={'/app-router/parallel-data'}>并行获取数据</Link>
    <p></p>
    <Link href={'/app-router/preloading-data'}>预加载获取数据</Link>
    <p></p>
    <Link href={'/app-router/api-test'}>api路由测试</Link>
    <p></p>
    <Link href={'/app-router/meta-data'}>动态元数据</Link>
  </>
}
