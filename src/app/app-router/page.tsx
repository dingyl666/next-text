

"use client"
import {useState} from "react";
import {usePathname} from "next/navigation";

export default function () {
  const [count,setCount] = useState(1) ;
  const pathname = usePathname()
  return (
    <>
      <button onClick={async () => {
        setCount(count => count + 1) ;

      }}>{count}</button>
    </>
  )
}
