
export default async function (props: any) {
  console.log("🚀 ~ file:page ~ line:3 -----", props)
  return (
    <>
      动态路由:pages/post/[...id].js，那么它将匹配 /post/1，/post/1/2，/post/1/2/3 等等
      与[[...pathname]]的唯一区别就是 后者包含/post路由 而 [...id]不包含 /post
    </>
  )
}
