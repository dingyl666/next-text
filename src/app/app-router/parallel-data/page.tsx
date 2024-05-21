
async function getArtist(username: string) {
  return await new Promise(resolve => {
    setTimeout(() => {
      resolve({
        name:'getArtist'
      })
    },1000)
  })
}

async function getArtistAlbums(username: string) {
  return await new Promise(resolve => {
    setTimeout(() => {
      resolve(
        [
          {
            id:111,name:'name1'
          },
          {
            id:222,name:'name2'
          }
        ]
      )
    },1000)
  })
}


async function Albums({list}:any) {
  return (
    <ul>
      {list.map((playlist:any) => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  )
}

export default async function Page({
                                     params: { username },
                                   }: {
  params: { username: string }
}) {
  // Initiate both requests in parallel
  const artistData = getArtist(username)
  const albumsData = getArtistAlbums(username)

  // Wait for the promises to resolve
  const [artist, albums]:any = await Promise.all([artistData, albumsData])

  return (
    <>
      <h1>{artist.name}</h1>
      <Albums list={albums}></Albums>
    </>
  )
}
