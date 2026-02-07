import data from './yt-dump-50.json'

const withCard = data.filter((d: any) => d.card)
const withCredits = data.filter((d: any) => d.credits)
const withMicroformat = data.filter((d: any) => d.microformat)

console.log(`Total: ${data.length}`)
console.log(`With music card: ${withCard.length}`)
console.log(`With credits dialog: ${withCredits.length}`)
console.log(`With microformat: ${withMicroformat.length}`)

// All unique keys in credits
const allCreditKeys = new Set<string>()
for (const d of withCredits) {
	for (const key of Object.keys((d as any).credits)) allCreditKeys.add(key)
}
console.log(`\nCredits keys: ${[...allCreditKeys].join(', ')}`)

// All unique keys in card
const allCardKeys = new Set<string>()
for (const d of withCard) {
	for (const key of Object.keys((d as any).card)) allCardKeys.add(key)
}
console.log(`Card keys: ${[...allCardKeys].join(', ')}`)

// Unique categories
const categories = new Set<string>()
for (const d of withMicroformat) {
	categories.add((d as any).microformat.category)
}
console.log(`Categories: ${[...categories].join(', ')}`)

// Show all credits entries
console.log(`\n--- All credits entries ---`)
for (const d of withCredits) {
	console.log(`  ${(d as any).r4_title}:`, JSON.stringify((d as any).credits))
}

// Show descHeader fields
console.log(`\n--- descHeader samples ---`)
for (const d of data.slice(0, 10) as any[]) {
	if (d.descHeader) {
		console.log(`  ${d.r4_title}: publishDate=${d.descHeader.publishDate}, factoids=${JSON.stringify(d.descHeader.factoids)}`)
	}
}

// videoDetails.musicVideoType values
const mvTypes = new Set<string>()
for (const d of data as any[]) {
	if (d.videoDetails?.musicVideoType) mvTypes.add(d.videoDetails.musicVideoType)
}
console.log(`\nmusicVideoType values: ${[...mvTypes].join(', ') || '(none found)'}`)

// microformat.publishDate range
const dates = (data as any[]).filter(d => d.microformat?.publishDate).map(d => d.microformat.publishDate)
console.log(`\npublishDate range: ${dates.length} entries`)
if (dates.length) {
	console.log(`  earliest: ${dates.sort()[0]}`)
	console.log(`  latest: ${dates.sort().at(-1)}`)
}

// lengthSeconds availability
const withLength = (data as any[]).filter(d => d.videoDetails?.lengthSeconds || d.microformat?.lengthSeconds)
console.log(`\nWith duration: ${withLength.length}/${data.length}`)
