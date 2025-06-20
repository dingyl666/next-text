
"use client"

import {useEffect, useState} from "react";

export default function ApiTest() {

  const [data,setData] = useState<{text?:string}>({text:'loading...'})

  useEffect(() => {
    fetch('/next/api/test/123').then(res => res.json())
      .then(res => {
        setData(res.data)
      })
  },[])
  return (
    <>
      api路由测试：{data?.text}
    </>
  )
}
