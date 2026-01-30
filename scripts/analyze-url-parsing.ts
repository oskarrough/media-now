import { parseUrl } from "../src/parse-url"

const tracks: Array<{ url: string }> = await Bun.file(
	"test-data/r4-tracks.json",
).json()

const results = tracks.map((t) => ({ url: t.url, parsed: parseUrl(t.url) }))
const valid = results.filter((r) => r.parsed !== null)
const invalid = results.filter((r) => r.parsed === null)

console.log(`Total: ${results.length}`)
console.log(
	`Valid: ${valid.length} (${((valid.length / results.length) * 100).toFixed(2)}%)`,
)
console.log(`Invalid: ${invalid.length}`)

// Group invalid by domain
const byDomain: Record<string, number> = {}
invalid.forEach((r) => {
	try {
		const domain = new URL(r.url).hostname
		byDomain[domain] = (byDomain[domain] || 0) + 1
	} catch {
		byDomain["(invalid url)"] = (byDomain["(invalid url)"] || 0) + 1
	}
})

console.log("\nInvalid URLs by domain:")
Object.entries(byDomain)
	.sort((a, b) => b[1] - a[1])
	.slice(0, 20)
	.forEach(([domain, count]) => console.log(`  ${domain}: ${count}`))

// Show sample URLs for top domains
console.log("\n--- Sample invalid URLs ---")
const topDomains = Object.entries(byDomain)
	.sort((a, b) => b[1] - a[1])
	.slice(0, 5)
	.map(([d]) => d)

for (const domain of topDomains) {
	console.log(`\n${domain}:`)
	const samples = invalid
		.filter((r) => {
			try {
				return new URL(r.url).hostname === domain
			} catch {
				return false
			}
		})
		.slice(0, 3)
	samples.forEach((s) => console.log(`  ${s.url}`))
}
