import Link from "next/link";
import Head from "next/head";

export default function Page() {
  return <>
    <Head>app router</Head>
    <Link href={'/page-router'}>
      <h1>Hello, Home page!</h1>
    </Link>
  </>
}
