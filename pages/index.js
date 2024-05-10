import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
import Date from '../components/date';

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      {/* Keep the existing code here */}

      {/* Add this <section> tag below the existing <section> tag */}
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog(自动部署测试)</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br/>
              <small className={utilStyles.lightText}>
                <Date dateString={date}/>
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  //静态生成的方式进行预渲染
  /**
   * 因为getStaticProps仅在服务器端运行。
   * 它永远不会在客户端运行。它甚至不会包含在浏览器的 JS 包中。
   * 这意味着您可以编写直接数据库查询等代码，而无需将它们发送到浏览器。
   * 由于静态生成在构建时发生一次，因此它不适合频繁更新或根据每个用户请求更改的数据
   */
  const allPostsData = getSortedPostsData();

  return {
    props: {
      allPostsData,
    },
  };
}

