import homepage from "./demo/index.html"

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": homepage,
  },
  development: true,
})

console.log(`Dev server running at ${server.url}`)
