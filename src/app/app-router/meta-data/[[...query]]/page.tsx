import {Metadata} from "next";


interface Props {
  params:{query: string[],},
  searchParams:{},
}

export function generateMetadata({params:{query}}: Props): Metadata {
  return {
    title: query ?query.join(',') : 'not query'
  }
}


export default async function MetaData(props:Props) {
  return (
    <>
      动态元数据 ,现在这个页面会会根据动态路径参数来生成title
    </>
  )
}
