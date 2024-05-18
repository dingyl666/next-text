

'use client'

export default function Error(
  {
    error,
    reset,
  }: {
    error: Error & { digest?: string }
    reset: () => void
  }
) {
  return (
    <div>
      <>app-router 以及其子路由的error ui</>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
