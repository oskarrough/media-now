import { parseTitle } from "../src/parse-title"

const tracks: Array<{ title: string }> = await Bun.file(
	"test-data/r4-tracks.json",
).json()

const noArtist = tracks.filter((t) => parseTitle(t.title).artist === null)

console.log(`\n=== Total tracks without artist: ${noArtist.length} / ${tracks.length} ===\n`)

// Pattern 1: Hyphen with space on one side only (e.g., "Artist- Title")
const hyphenOneSpace = noArtist.filter((t) => {
	return (
		(/\S-\s/.test(t.title) || /\s-\S/.test(t.title)) && !/ - /.test(t.title)
	)
})

console.log(`\n=== PATTERN 1: Hyphen with space on one side (${hyphenOneSpace.length}) ===`)
console.log("These look like 'Artist- Title' or 'Artist -Title' typos\n")
hyphenOneSpace.slice(0, 30).forEach((t, i) => {
	console.log(`${i + 1}. "${t.title}"`)
})

// Pattern 2: Multiple spaces as separator
const multipleSpaces = noArtist.filter((t) => /\s{3,}/.test(t.title))

console.log(`\n\n=== PATTERN 2: Multiple spaces as separator (${multipleSpaces.length}) ===`)
console.log("These use 3+ spaces between artist and title\n")
multipleSpaces.slice(0, 30).forEach((t, i) => {
	console.log(`${i + 1}. "${t.title}"`)
})

// Pattern 3: Double-dash truncation losing title
const doubleDash = tracks.filter((t) => {
	const result = parseTitle(t.title)
	return t.title.includes("--") && result.artist === null
})

console.log(`\n\n=== PATTERN 3: Double-dash truncation issues (${doubleDash.length}) ===`)
console.log("These get truncated at -- before separator is found\n")
doubleDash.slice(0, 20).forEach((t, i) => {
	console.log(`${i + 1}. "${t.title}"`)
	console.log(`   -> parsed title: "${parseTitle(t.title).title}"`)
})

// Pattern 4: En-dash without spaces
const enDashNoSpaces = noArtist.filter(
	(t) => t.title.includes("–") && !/ – /.test(t.title),
)

console.log(`\n\n=== PATTERN 4: En-dash without spaces (${enDashNoSpaces.length}) ===`)
enDashNoSpaces.slice(0, 15).forEach((t, i) => {
	console.log(`${i + 1}. "${t.title}"`)
})

// Pattern 5: Em-dash (—) which we don't handle
const emDash = noArtist.filter((t) => t.title.includes("—"))

console.log(`\n\n=== PATTERN 5: Em-dash — not handled (${emDash.length}) ===`)
emDash.slice(0, 15).forEach((t, i) => {
	console.log(`${i + 1}. "${t.title}"`)
})
