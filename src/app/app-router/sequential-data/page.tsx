
// ...

import {Suspense} from "react";

async function Playlists({ artistID }: { artistID: string }) {
  // Wait for the playlists
  const playlists:any = await new Promise(resolve => {
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

  return (
    <ul>
      {playlists.map((playlist:any) => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  )
}

export default async function Page({params: { username },}: {
  params: { username: string }
}) {
  // Wait for the artist
  const artist:any = await new Promise(resolve => {
    setTimeout(() => {
      resolve({
        name:'name111',
        id:'id:222'
      })
    },1000)
  })

  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Playlists artistID={artist.id} />
      </Suspense>
    </>
  )
}
