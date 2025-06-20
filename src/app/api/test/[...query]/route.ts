
import {NextRequest} from "next/server";


export async function GET(request: NextRequest, context: { params: Promise<{query: string[]}> }) {
  const {query} = await context.params
  console.log("🚀 ~ file:route ~ line:6 -----", query)
  const res = await fetch('http://47.94.178.99/test0', {
    headers: {
      'Content-Type': 'application/json',
      // 'API-Key': process.env.DATA_API_KEY,
    },
    next:{
      revalidate:10,//Revalidate every 60 seconds
    }
  })
  const data:{
    text:string,
    data:string
  } = await res.json()

  return Response.json({ data })
}
