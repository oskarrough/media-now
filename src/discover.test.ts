import { describe, expect, it, vi, beforeEach, type Mock } from "vitest"
import { discoverDiscogsUrl } from "./discover"
import * as musicbrainz from "./providers/musicbrainz"

// Mock the musicbrainz provider
vi.mock("./providers/musicbrainz", () => ({
	search: vi.fn(),
	fetchRecording: vi.fn(),
	fetchRelease: vi.fn(),
}))

const mockSearch = musicbrainz.search as Mock
const mockFetchRecording = musicbrainz.fetchRecording as Mock
const mockFetchRelease = musicbrainz.fetchRelease as Mock

describe("discoverDiscogsUrl", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("returns null when no recordings found", async () => {
		mockSearch.mockResolvedValue([])

		const result = await discoverDiscogsUrl("Unknown Artist - Unknown Song")
		expect(result).toBeNull()
	})

	it("returns null when recording has no releases", async () => {
		mockSearch.mockResolvedValue([
			{
				provider: "musicbrainz",
				id: "rec-1",
				url: "https://musicbrainz.org/recording/rec-1",
				title: "Test Song",
				artist: "Test Artist",
				releases: [],
				payload: {},
			},
		])
		mockFetchRecording.mockResolvedValue({
			provider: "musicbrainz",
			id: "rec-1",
			url: "https://musicbrainz.org/recording/rec-1",
			title: "Test Song",
			artist: "Test Artist",
			releases: [],
			payload: { releases: [] },
		})

		const result = await discoverDiscogsUrl("Test Artist - Test Song")
		expect(result).toBeNull()
	})

	it("returns null when releases have no Discogs URLs", async () => {
		mockSearch.mockResolvedValue([
			{
				provider: "musicbrainz",
				id: "rec-1",
				url: "https://musicbrainz.org/recording/rec-1",
				title: "Test Song",
				artist: "Test Artist",
				releases: ["Test Album"],
				payload: {},
			},
		])
		mockFetchRecording.mockResolvedValue({
			provider: "musicbrainz",
			id: "rec-1",
			url: "https://musicbrainz.org/recording/rec-1",
			title: "Test Song",
			artist: "Test Artist",
			releases: ["Test Album"],
			payload: { releases: [{ id: "rel-1" }] },
		})
		mockFetchRelease.mockResolvedValue({
			id: "rel-1",
			title: "Test Album",
			url: "https://musicbrainz.org/release/rel-1",
			relations: [{ type: "amazon asin", url: "https://amazon.com/test" }],
			payload: {},
		})

		const result = await discoverDiscogsUrl("Test Artist - Test Song")
		expect(result).toBeNull()
	})

	it("returns Discogs URL when found in release relations", async () => {
		mockSearch.mockResolvedValue([
			{
				provider: "musicbrainz",
				id: "rec-1",
				url: "https://musicbrainz.org/recording/rec-1",
				title: "Test Song",
				artist: "Test Artist",
				releases: ["Test Album"],
				payload: {},
			},
		])
		mockFetchRecording.mockResolvedValue({
			provider: "musicbrainz",
			id: "rec-1",
			url: "https://musicbrainz.org/recording/rec-1",
			title: "Test Song",
			artist: "Test Artist",
			releases: ["Test Album"],
			payload: { releases: [{ id: "rel-1" }] },
		})
		mockFetchRelease.mockResolvedValue({
			id: "rel-1",
			title: "Test Album",
			url: "https://musicbrainz.org/release/rel-1",
			relations: [
				{ type: "discogs", url: "https://www.discogs.com/release/12345" },
			],
			payload: {},
		})

		const result = await discoverDiscogsUrl("Test Artist - Test Song")
		expect(result).toBe("https://www.discogs.com/release/12345")
	})

	it("iterates through multiple recordings to find Discogs URL", async () => {
		// First recording has no releases
		// Second recording has a release with Discogs URL
		mockSearch.mockResolvedValue([
			{
				provider: "musicbrainz",
				id: "rec-1",
				url: "https://musicbrainz.org/recording/rec-1",
				title: "Test Song",
				artist: "Test Artist",
				releases: [],
				payload: {},
			},
			{
				provider: "musicbrainz",
				id: "rec-2",
				url: "https://musicbrainz.org/recording/rec-2",
				title: "Test Song",
				artist: "Test Artist",
				releases: ["Test Album"],
				payload: {},
			},
		])
		mockFetchRecording
			.mockResolvedValueOnce({
				provider: "musicbrainz",
				id: "rec-1",
				url: "https://musicbrainz.org/recording/rec-1",
				title: "Test Song",
				artist: "Test Artist",
				releases: [],
				payload: { releases: [] },
			})
			.mockResolvedValueOnce({
				provider: "musicbrainz",
				id: "rec-2",
				url: "https://musicbrainz.org/recording/rec-2",
				title: "Test Song",
				artist: "Test Artist",
				releases: ["Test Album"],
				payload: { releases: [{ id: "rel-2" }] },
			})
		mockFetchRelease.mockResolvedValue({
			id: "rel-2",
			title: "Test Album",
			url: "https://musicbrainz.org/release/rel-2",
			relations: [
				{ type: "discogs", url: "https://www.discogs.com/release/67890" },
			],
			payload: {},
		})

		const result = await discoverDiscogsUrl("Test Artist - Test Song")
		expect(result).toBe("https://www.discogs.com/release/67890")
		expect(mockFetchRecording).toHaveBeenCalledTimes(2)
	})

	it("prefers album releases over compilations", async () => {
		mockSearch.mockResolvedValue([
			{
				provider: "musicbrainz",
				id: "rec-1",
				url: "https://musicbrainz.org/recording/rec-1",
				title: "Test Song",
				artist: "Test Artist",
				releases: ["Compilation", "Original Album"],
				payload: {},
			},
		])
		// Recording payload now includes full release metadata for pre-filtering
		mockFetchRecording.mockResolvedValue({
			provider: "musicbrainz",
			id: "rec-1",
			url: "https://musicbrainz.org/recording/rec-1",
			title: "Test Song",
			artist: "Test Artist",
			releases: ["Compilation", "Original Album"],
			payload: {
				releases: [
					{
						id: "rel-1",
						title: "Compilation",
						"artist-credit": [{ name: "Various Artists" }],
						"release-group": {
							"primary-type": "Album",
							"secondary-types": ["Compilation"],
						},
					},
					{
						id: "rel-2",
						title: "Original Album",
						"artist-credit": [{ name: "Test Artist" }],
						"release-group": { "primary-type": "Album", "secondary-types": [] },
					},
				],
			},
		})
		// Now only the higher-scored release should be fetched
		mockFetchRelease.mockResolvedValue({
			id: "rel-2",
			title: "Original Album",
			url: "https://musicbrainz.org/release/rel-2",
			relations: [
				{ type: "discogs", url: "https://www.discogs.com/release/original" },
			],
			payload: {
				"artist-credit": [{ name: "Test Artist" }],
				"release-group": { "primary-type": "Album", "secondary-types": [] },
			},
		})

		const result = await discoverDiscogsUrl("Test Artist - Test Song")
		// Should prefer the original album over the compilation
		expect(result).toBe("https://www.discogs.com/release/original")
	})
})
