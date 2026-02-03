/**
 * Integration tests for providers - run manually against real APIs
 *
 * Usage: bun run test:integration
 *
 * This script calls each provider with known IDs and logs results for manual inspection.
 * Not run in CI - for verification and documentation purposes only.
 */

import { youtube } from "../src/providers/youtube"
import { vimeo } from "../src/providers/vimeo"
import { spotify } from "../src/providers/spotify"
import { discogs } from "../src/providers/discogs"
import { musicbrainz } from "../src/providers/musicbrainz"
import { soundcloud } from "../src/providers/soundcloud"

interface TestCase {
	name: string
	fn: () => Promise<unknown>
}

const testCases: TestCase[] = [
	// YouTube
	{
		name: 'youtube.fetch("dQw4w9WgXcQ") - Rick Astley',
		fn: () => youtube.fetch("dQw4w9WgXcQ"),
	},
	{
		name: 'youtube.search("never gonna give you up")',
		fn: () => youtube.search("never gonna give you up"),
	},

	// Vimeo
	{
		name: 'vimeo.fetch("76979871") - known video',
		fn: () => vimeo.fetch("76979871"),
	},

	// Spotify
	{
		name: 'spotify.fetch("4cOdK2wGLETKBW3PvgPWqT") - Rick Astley track',
		fn: () => spotify.fetch("4cOdK2wGLETKBW3PvgPWqT"),
	},

	// Discogs
	{
		name: 'discogs.fetch("1") - first release',
		fn: () => discogs.fetch("1"),
	},
	{
		name: 'discogs.fetchMaster("8471") - AC/DC - Back in Black',
		fn: () => discogs.fetchMaster("8471"),
	},

	// MusicBrainz - using Bohemian Rhapsody recording UUID from search
	{
		name: 'musicbrainz.search("Bohemian Rhapsody")',
		fn: () => musicbrainz.search("Bohemian Rhapsody"),
	},
	{
		name: 'musicbrainz.fetchRecording("46fe768c-7b38-4147-9f02-815b9f0759e2") - Bohemian Rhapsody',
		fn: () => musicbrainz.fetchRecording("46fe768c-7b38-4147-9f02-815b9f0759e2"),
	},

	// SoundCloud
	{
		name: 'soundcloud.fetch("forss/flickermood") - known track',
		fn: () => soundcloud.fetch("forss/flickermood"),
	},
]

const formatResult = (result: unknown): string => {
	const str = JSON.stringify(result, null, 2)
	// Truncate payload for readability
	const lines = str.split("\n")
	if (lines.length > 40) {
		return `${lines.slice(0, 40).join("\n")}\n  ... (truncated)`
	}
	return str
}

const runTests = async () => {
	console.log("=".repeat(60))
	console.log("Provider Integration Tests")
	console.log("=".repeat(60))
	console.log("")

	let passed = 0
	let failed = 0

	for (const test of testCases) {
		console.log(`\n${"─".repeat(60)}`)
		console.log(`TEST: ${test.name}`)
		console.log("─".repeat(60))

		try {
			const result = await test.fn()
			console.log("STATUS: PASS")
			console.log("\nRESULT:")
			console.log(formatResult(result))
			passed++
		} catch (error) {
			console.log("STATUS: FAIL")
			console.log(
				"\nERROR:",
				error instanceof Error ? error.message : String(error),
			)
			failed++
		}
	}

	console.log(`\n${"=".repeat(60)}`)
	console.log(`SUMMARY: ${passed} passed, ${failed} failed`)
	console.log("=".repeat(60))

	if (failed > 0) {
		process.exit(1)
	}
}

runTests()
