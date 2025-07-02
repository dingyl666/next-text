import Link from "next/link";
import Head from "next/head";
import './globals.css'
export default function Page() {
  return <>
    <Head>app router</Head>
    <span className="text-red-500 ">hello world</span>
    <Link href={'/page-router'}><h1>pages router</h1></Link>
    <Link href={'/app-router'} scroll={false}><h1>app router</h1></Link>
  </>
}
