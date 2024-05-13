
import useSWR from "swr";
import {prodTestUrl} from "../../utils/utils";

const fetcher = (...args) => fetch(...args).then((res) => res.json())
export default function CSR() {
  const { data, error } = useSWR(prodTestUrl,fetcher);
  if (error) {
    console.log("🚀 ~ file:csr ~ line:9 -----", error,process.env.PORT)
    return <div>Error...</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return <>
    <h1>这是客户端渲染的页面</h1>
    {data.text}
  </>
}
