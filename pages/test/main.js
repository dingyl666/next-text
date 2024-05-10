import Link from "next/link";


export default function Main () {
  return (
    <>
      <p>
        <Link href={`/test/ssg`}>静态生成页面SSG</Link>
      </p>
      <p>
        <Link href={`/test/isr`}>增量静态生成页面ISR</Link>
      </p>
      <p>
        <Link href={`/test/csr`}>客户端渲染CSR</Link>
      </p>
      <p>
        <Link href={`/test/ssr`}>服务端渲染页面SSR</Link>
      </p>
    </>
  )
}
