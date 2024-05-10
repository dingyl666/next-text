

export default async function handler(req, res) {

  await new Promise(resolve => {
    setTimeout(() => {
      resolve('')
    },2000)
  })
  res.status(200).json({ text: new Date().valueOf() });
}
