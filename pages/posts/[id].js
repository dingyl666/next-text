

import Layout from '../../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import Head from "next/head";
import Date from '../../components/date';

import utilStyles from '../../styles/utils.module.css';
export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <h1>
        <Date dateString={postData.date}/>
      </h1>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date}/>
        </div>
        <div dangerouslySetInnerHTML={{__html: postData.contentHtml}}/>
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  /**
   * 如果fallback是false，则任何未返回的路径getStaticPaths都将导致404 页面。
   * 如果fallback是true，则行为发生getStaticProps变化：
   */
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({params}) {
  // Add the "await" keyword like this:
  const postData = await getPostData(params.id);

  return {
    props: {
      postData,
    },
  };
}
