/**
 * Fetch tracks directly from Supabase - much faster than channel-by-channel.
 * 10 paginated requests instead of 500 channel requests.
 *
 * Usage: bun scripts/fetch-r4-tracks-supabase.ts
 */

import { writeFileSync } from "node:fs"

const SUPABASE_URL = "https://gfuopkuvfhoncknthpdo.supabase.co"
const SUPABASE_ANON_KEY =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmdW9wa3V2Zmhvbmtudq0gcGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM2MDA0NTksImV4cCI6MjAxOTE3NjQ1OX0.loLkzR6sHlPK3PoC5aPPbrBP3oYoPsUL2OgsXOjUvIc"

const PAGE_SIZE = 2000
const TOTAL_PAGES = 10

interface Track {
	id: string
	title: string
	url: string
	channel_id: string
}

async function fetchPage(page: number): Promise<Track[]> {
	const from = page * PAGE_SIZE
	const to = from + PAGE_SIZE - 1

	const url = `${SUPABASE_URL}/rest/v1/tracks?select=id,title,url,channel_id&order=created_at.desc&offset=${from}&limit=${PAGE_SIZE}`

	const response = await fetch(url, {
		headers: {
			apikey: SUPABASE_ANON_KEY,
			Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
		},
	})

	if (!response.ok) {
		throw new Error(`Failed to fetch page ${page}: ${response.statusText}`)
	}

	return response.json()
}

async function main() {
	console.log(`Fetching ${TOTAL_PAGES} pages of ${PAGE_SIZE} tracks each...`)

	const allTracks: Track[] = []

	for (let page = 0; page < TOTAL_PAGES; page++) {
		console.log(`Fetching page ${page + 1}/${TOTAL_PAGES}...`)
		const tracks = await fetchPage(page)
		allTracks.push(...tracks)

		if (tracks.length < PAGE_SIZE) {
			console.log(`Page ${page + 1} returned ${tracks.length} tracks (last page)`)
			break
		}
	}

	const outputPath = "test-data/r4-tracks.json"
	writeFileSync(outputPath, JSON.stringify(allTracks, null, 2))
	console.log(`\nTotal tracks: ${allTracks.length}`)
	console.log(`Saved to ${outputPath}`)
}

main().catch(console.error)
