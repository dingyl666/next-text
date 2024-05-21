

export default async function (props:{params:{pathname:string}}) {
  return <>
    动态路由:pages/post/[[...id]].js，那么它将匹配 /post，/post/1，/post/1/2，/post/1/2/3 等等
    <p>与[...id]的区别是 如果没有设置/post，他会捕获/post</p>
  </>
}
