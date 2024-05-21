import {getItem} from "../../../../utils/get-item";


const preload = (id: string) => {
  void getItem(id)
}

async function Item({ id }: { id: string }) {
  const result:any = await getItem(id)
  return <>{result.name}</>
}
export default async function Page() {
  // starting loading item data
  const id = '111' ;
  preload(id) ;
  // perform another asynchronous task
  const isAvailable = await new Promise(resolve => {
    setTimeout(() => {
      resolve(111)
    },1000)
  })

  return isAvailable ? <Item id={id} /> : null
}
