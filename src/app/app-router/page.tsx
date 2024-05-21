import Link from "next/link";

export default async function () {
  return <>
    <Link href={'/app-router/sequential-data'}>顺序获取数据</Link>
    <p></p>
    <Link href={'/app-router/parallel-data'}>并行获取数据</Link>
    <p></p>
    <Link href={'/app-router/preloading-data'}>预加载获取数据</Link>
  </>
}
