
import {NextRequest} from "next/server";
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";


export async function GET(request: NextRequest, context: { params: Params }) {
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
