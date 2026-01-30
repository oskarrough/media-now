import { describe, expect, it } from "vitest"
import { cleanTitle, parseTitle } from "./parse-title"

// Load r4 tracks for bulk testing
let r4Tracks: Array<{ title: string }> = []
const r4TracksFile = Bun.file(
	new URL("../test-data/r4-tracks.json", import.meta.url),
)
if (await r4TracksFile.exists()) {
	r4Tracks = await r4TracksFile.json()
}

describe("parseTitle", () => {
	it("splits on hyphen with spaces", () => {
		const result = parseTitle("Daft Punk - Get Lucky")
		expect(result.artist).toBe("Daft Punk")
		expect(result.title).toBe("Get Lucky")
		expect(result.original).toBe("Daft Punk - Get Lucky")
	})

	it("splits on en-dash with spaces", () => {
		const result = parseTitle("Daft Punk – Get Lucky")
		expect(result.artist).toBe("Daft Punk")
		expect(result.title).toBe("Get Lucky")
	})

	it("splits on colon with space", () => {
		const result = parseTitle("Daft Punk: Get Lucky")
		expect(result.artist).toBe("Daft Punk")
		expect(result.title).toBe("Get Lucky")
	})

	it("splits on pipe with spaces", () => {
		const result = parseTitle("Daft Punk | Get Lucky")
		expect(result.artist).toBe("Daft Punk")
		expect(result.title).toBe("Get Lucky")
	})

	it('splits on " by " (case insensitive) - artist after', () => {
		const result = parseTitle("Get Lucky by Daft Punk")
		expect(result.artist).toBe("Daft Punk")
		expect(result.title).toBe("Get Lucky")
	})

	it('splits on " BY " (uppercase)', () => {
		const result = parseTitle("Get Lucky BY Daft Punk")
		expect(result.artist).toBe("Daft Punk")
		expect(result.title).toBe("Get Lucky")
	})

	it("returns null artist when no separator found", () => {
		const result = parseTitle("Get Lucky")
		expect(result.artist).toBe(null)
		expect(result.title).toBe("Get Lucky")
	})

	it("hyphen takes precedence over by", () => {
		const result = parseTitle("Daft Punk - Stand by Me")
		expect(result.artist).toBe("Daft Punk")
		expect(result.title).toBe("Stand by Me")
	})

	it("cleans title before parsing", () => {
		const result = parseTitle("Daft Punk - Get Lucky (feat. Pharrell)")
		expect(result.artist).toBe("Daft Punk")
		expect(result.title).toBe("Get Lucky")
	})

	it("preserves original in output", () => {
		const input = "Daft Punk - Get Lucky (feat. Pharrell) [Official Video]"
		const result = parseTitle(input)
		expect(result.original).toBe(input)
	})
})

describe("parseTitle with real r4 tracks", () => {
	// Tests edge cases discovered from Radio4000 track data

	it("truncates at double-dash before finding separator (loses title)", () => {
		// r4: a-docks "Cabaret Voltaire -- What Is Real"
		// The -- truncation happens BEFORE separator detection
		const result = parseTitle("Cabaret Voltaire -- What Is Real")
		expect(result.artist).toBe(null) // No separator found after truncation
		expect(result.title).toBe("Cabaret Voltaire")
	})

	it("uses first separator when multiple exist", () => {
		// r4: a-docks "Do I Believe In God - LNTG (...) - Prince Re-edit"
		const result = parseTitle("Artist One - Title - Artist Two")
		expect(result.artist).toBe("Artist One")
		expect(result.title).toBe("Title - Artist Two") // Second hyphen preserved
	})

	it("removes quotes inside parentheticals", () => {
		// r4: a-docks "LETTA MBULU - Kilimanjaro (1981 12\")"
		const result = parseTitle('LETTA MBULU - Kilimanjaro (1981 12")')
		expect(result.artist).toBe("LETTA MBULU")
		expect(result.title).toBe("Kilimanjaro")
	})

	it("only removes TRAILING parentheticals (mid-string parens preserved in title)", () => {
		// Parenthetical not at end is preserved until after split
		// "Artist - Title (info) more" - the (info) is not trailing
		const result = parseTitle("Artist - Title (remix) - More Info")
		expect(result.title).toBe("Title (remix) - More Info")
	})

	it("handles hyphenated words in artist name correctly", () => {
		// r4: 918 "X-Ray Spex - Oh Bondage Up Yours !"
		const result = parseTitle("X-Ray Spex - Oh Bondage Up Yours !")
		expect(result.artist).toBe("X-Ray Spex") // Hyphen in name preserved
		expect(result.title).toBe("Oh Bondage Up Yours !")
	})

	it("does not strip hyphenated suffixes like Re-edit", () => {
		// r4: a-docks "... - Prince Re-edit" - "Re-edit" not matched by remix pattern
		// The pattern requires space before edit: `\s+edit`
		expect(cleanTitle("Title Re-edit")).toBe("Title Re-edit")
		expect(cleanTitle("Title edit")).toBe("Title") // But standalone edit IS removed
	})

	it("handles Unicode in artist and title", () => {
		// r4: 21st-century-waver "Kælan Mikla - Næturblóm"
		const result = parseTitle("Kælan Mikla - Næturblóm")
		expect(result.artist).toBe("Kælan Mikla")
		expect(result.title).toBe("Næturblóm")
	})

	it("parses tracks with no separator as title-only", () => {
		// r4: 1955radio-saudade "GERA EMOÇÃO E SAUDADE"
		const result = parseTitle("GERA EMOÇÃO E SAUDADE")
		expect(result.artist).toBe(null)
		expect(result.title).toBe("GERA EMOÇÃO E SAUDADE")
	})
})

describe("cleanTitle", () => {
	it("removes content after //", () => {
		expect(cleanTitle("Artist - Title // Album Info")).toBe("Artist - Title")
	})

	it("removes content after \\\\", () => {
		expect(cleanTitle("Artist - Title \\\\ More Info")).toBe("Artist - Title")
	})

	it("removes content after ||", () => {
		expect(cleanTitle("Artist - Title || Extra")).toBe("Artist - Title")
	})

	it("removes content after --", () => {
		expect(cleanTitle("Artist - Title -- 2024")).toBe("Artist - Title")
	})

	it("removes trailing parentheticals", () => {
		expect(cleanTitle("Get Lucky (Official Video)")).toBe("Get Lucky")
	})

	it("removes multiple trailing parentheticals", () => {
		expect(cleanTitle("Get Lucky (feat. Pharrell) (Official)")).toBe(
			"Get Lucky",
		)
	})

	it("removes trailing brackets", () => {
		expect(cleanTitle("Get Lucky [HD]")).toBe("Get Lucky")
	})

	it("removes multiple trailing brackets", () => {
		expect(cleanTitle("Get Lucky [Remix] [HD]")).toBe("Get Lucky")
	})

	it("removes feat. info", () => {
		expect(cleanTitle("Get Lucky feat. Pharrell")).toBe("Get Lucky")
	})

	it("removes ft. info", () => {
		expect(cleanTitle("Get Lucky ft. Pharrell")).toBe("Get Lucky")
	})

	it("removes featuring info", () => {
		expect(cleanTitle("Get Lucky featuring Pharrell")).toBe("Get Lucky")
	})

	it("removes with info", () => {
		expect(cleanTitle("Get Lucky with Pharrell")).toBe("Get Lucky")
	})

	it("removes remix suffix", () => {
		expect(cleanTitle("Get Lucky Remix")).toBe("Get Lucky")
	})

	it("removes edit suffix", () => {
		expect(cleanTitle("Get Lucky Edit")).toBe("Get Lucky")
	})

	it("removes version suffix", () => {
		expect(cleanTitle("Get Lucky Version")).toBe("Get Lucky")
	})

	it("removes mix suffix", () => {
		expect(cleanTitle("Get Lucky Mix")).toBe("Get Lucky")
	})

	it("removes dub suffix", () => {
		expect(cleanTitle("Get Lucky Dub")).toBe("Get Lucky")
	})

	it("trims whitespace", () => {
		expect(cleanTitle("  Get Lucky  ")).toBe("Get Lucky")
	})

	it("collapses multiple spaces", () => {
		expect(cleanTitle("Get    Lucky")).toBe("Get Lucky")
	})

	it("handles complex example from spec", () => {
		expect(
			cleanTitle("Daft Punk - Get Lucky (feat. Pharrell) [Official Video]"),
		).toBe("Daft Punk - Get Lucky")
	})

	it("handles empty string", () => {
		expect(cleanTitle("")).toBe("")
	})
})

/**
 * Edge cases discovered from r4 dataset analysis (scripts/analyze-patterns.ts)
 * These are currently FAILING tests documenting patterns we want to support.
 * Stats from 39545 tracks:
 * - 514 tracks: hyphen with space on one side ("Artist- Title")
 * - 221 tracks: multiple spaces as separator ("Title   Artist")
 * - 67 tracks: double-dash used as separator, but truncated
 * - 39 tracks: en-dash without spaces ("Artist‎–Title")
 * - 219 tracks: em-dash not handled ("Artist—Title")
 */
describe("parseTitle edge cases (discovered from r4 data)", () => {
	// PATTERN 1: Em-dash — (219 tracks)
	// Currently not handled at all
	it("splits on em-dash with spaces", () => {
		// r4: "Def Leppard — Animal"
		const result = parseTitle("Def Leppard — Animal")
		expect(result.artist).toBe("Def Leppard")
		expect(result.title).toBe("Animal")
	})

	it("splits on em-dash without spaces", () => {
		// r4: "Galapagoose—Don't Break the Spell"
		const result = parseTitle("Galapagoose—Don't Break the Spell")
		expect(result.artist).toBe("Galapagoose")
		expect(result.title).toBe("Don't Break the Spell")
	})

	// PATTERN 2: Hyphen with space on one side (514 tracks)
	// Typos/inconsistent formatting
	it("splits on hyphen-space (Artist- Title)", () => {
		// r4: "Seu Jorge- Tive Razao"
		const result = parseTitle("Seu Jorge- Tive Razao")
		expect(result.artist).toBe("Seu Jorge")
		expect(result.title).toBe("Tive Razao")
	})

	it("splits on space-hyphen (Artist -Title)", () => {
		// r4: "Ray Hildebrand -Turn It Over To Jesus (1967)"
		const result = parseTitle("Ray Hildebrand -Turn It Over To Jesus")
		expect(result.artist).toBe("Ray Hildebrand")
		expect(result.title).toBe("Turn It Over To Jesus")
	})

	// PATTERN 3: Double-dash as separator (67 tracks)
	// Currently truncates before separator detection, losing the title
	it("treats spaced double-dash as separator, not truncation", () => {
		// r4: "Boards Of Canada -- Amo Bishop Roden"
		// Currently: truncates at --, result is just "Boards Of Canada"
		// Desired: split on " -- " as a separator
		const result = parseTitle("Boards Of Canada -- Amo Bishop Roden")
		expect(result.artist).toBe("Boards Of Canada")
		expect(result.title).toBe("Amo Bishop Roden")
	})

	it("treats non-spaced double-dash as separator when at word boundary", () => {
		// r4: "Dick Dale---Banzai Pipeline."
		// Currently truncates, desired: find artist/title
		const result = parseTitle("Dick Dale---Banzai Pipeline")
		expect(result.artist).toBe("Dick Dale")
		expect(result.title).toBe("Banzai Pipeline")
	})

	// PATTERN 4: En-dash without spaces (39 tracks)
	// We only handle " – " (with spaces)
	it("splits on en-dash without spaces", () => {
		// r4: "Boney M. ‎– Kalimba De Luna" (note: has invisible char before –)
		// Simpler test case:
		const result = parseTitle("Artist–Title")
		expect(result.artist).toBe("Artist")
		expect(result.title).toBe("Title")
	})

	// PATTERN 5: Multiple spaces as separator (221 tracks)
	// Portuguese radio station uses "Title   Artist" format with 3+ spaces
	it("splits on multiple spaces (3+) as separator", () => {
		// r4: "Oh Lady Mary   David Alexandre Winter"
		const result = parseTitle("Oh Lady Mary   David Alexandre Winter")
		// Note: these are reversed - title first, artist second
		expect(result.title).toBe("Oh Lady Mary")
		expect(result.artist).toBe("David Alexandre Winter")
	})
})

describe("parseTitle bulk test with r4 tracks", () => {
	it(`parses all ${r4Tracks.length} r4 tracks without throwing`, () => {
		if (r4Tracks.length === 0) {
			console.warn("No r4 tracks loaded - run scripts/fetch-r4-tracks.sh first")
			return
		}

		const results = r4Tracks.map((track) => {
			const result = parseTitle(track.title)
			return {
				input: track.title,
				...result,
			}
		})

		// All results should have required fields
		for (const r of results) {
			expect(r.title).toBeDefined()
			expect(typeof r.title).toBe("string")
			expect(r.original).toBe(r.input)
		}
	})

	it("extracts artist from majority of tracks (sanity check)", () => {
		if (r4Tracks.length === 0) return

		const withArtist = r4Tracks.filter(
			(t) => parseTitle(t.title).artist !== null,
		)
		const percentage = (withArtist.length / r4Tracks.length) * 100

		console.log(
			`Artist extracted: ${withArtist.length}/${r4Tracks.length} (${percentage.toFixed(1)}%)`,
		)

		// Expect at least 50% of tracks to have artist - title format
		expect(percentage).toBeGreaterThan(50)
	})
})
