

export async function getItem (id:string) {
  return await new Promise(resolve => {
    setTimeout(() => {
      resolve({
        name:'name111',
        id
      })
    },1000)
  })
}
