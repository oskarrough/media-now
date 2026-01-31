/** Dev server for testing the demo page */
const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url)
    const path = url.pathname === "/" ? "/index.html" : url.pathname
    const file = Bun.file(`.${path}`)

    if (await file.exists()) {
      return new Response(file)
    }
    return new Response("Not found", { status: 404 })
  },
})

console.log(`Dev server running at ${server.url}`)
