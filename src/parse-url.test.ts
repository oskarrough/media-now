import { describe, expect, it } from "vitest"
import { parseUrl } from "./parse-url"
import r4Tracks from "../test-data/r4-tracks.json"

describe("parseUrl", () => {
	describe("YouTube", () => {
		it("parses watch?v= URLs", () => {
			expect(parseUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toEqual({
				provider: "youtube",
				id: "dQw4w9WgXcQ",
			})
		})

		it("parses watch URLs with extra params", () => {
			expect(
				parseUrl("https://youtube.com/watch?v=abc123&t=42s&list=PL1234"),
			).toEqual({
				provider: "youtube",
				id: "abc123",
			})
		})

		it("parses youtu.be short URLs", () => {
			expect(parseUrl("https://youtu.be/dQw4w9WgXcQ")).toEqual({
				provider: "youtube",
				id: "dQw4w9WgXcQ",
			})
		})

		it("parses youtu.be with query params", () => {
			expect(parseUrl("https://youtu.be/abc123?t=42")).toEqual({
				provider: "youtube",
				id: "abc123",
			})
		})

		it("parses /embed/ URLs", () => {
			expect(parseUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")).toEqual({
				provider: "youtube",
				id: "dQw4w9WgXcQ",
			})
		})

		it("parses /shorts/ URLs", () => {
			expect(parseUrl("https://youtube.com/shorts/abc123")).toEqual({
				provider: "youtube",
				id: "abc123",
			})
		})

		it("handles http URLs", () => {
			expect(parseUrl("http://youtube.com/watch?v=test123")).toEqual({
				provider: "youtube",
				id: "test123",
			})
		})

		it("parses m.youtube.com (mobile) URLs", () => {
			expect(parseUrl("https://m.youtube.com/watch?v=abc123")).toEqual({
				provider: "youtube",
				id: "abc123",
			})
		})

		it("parses music.youtube.com URLs", () => {
			expect(
				parseUrl("https://music.youtube.com/watch?v=xyz789&feature=share"),
			).toEqual({
				provider: "youtube",
				id: "xyz789",
			})
		})
	})

	describe("Vimeo", () => {
		it("parses vimeo.com/{id} URLs", () => {
			expect(parseUrl("https://vimeo.com/123456789")).toEqual({
				provider: "vimeo",
				id: "123456789",
			})
		})

		it("parses vimeo.com/{id} with trailing slash", () => {
			expect(parseUrl("https://vimeo.com/123456789/")).toEqual({
				provider: "vimeo",
				id: "123456789",
			})
		})

		it("parses player embed URLs", () => {
			expect(parseUrl("https://player.vimeo.com/video/123456789")).toEqual({
				provider: "vimeo",
				id: "123456789",
			})
		})

		it("parses /video/ URLs with query params", () => {
			expect(parseUrl("https://vimeo.com/video/123456789?h=abc")).toEqual({
				provider: "vimeo",
				id: "123456789",
			})
		})

		it("handles www prefix", () => {
			expect(parseUrl("https://www.vimeo.com/123456789")).toEqual({
				provider: "vimeo",
				id: "123456789",
			})
		})
	})

	describe("Spotify", () => {
		it("parses track URLs", () => {
			expect(
				parseUrl("https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT"),
			).toEqual({
				provider: "spotify",
				id: "4cOdK2wGLETKBW3PvgPWqT",
			})
		})

		it("parses track URLs with query params", () => {
			expect(parseUrl("https://open.spotify.com/track/abc123?si=xyz")).toEqual({
				provider: "spotify",
				id: "abc123",
			})
		})

		it("rejects playlist URLs", () => {
			expect(parseUrl("https://open.spotify.com/playlist/abc123")).toBeNull()
		})

		it("rejects album URLs", () => {
			expect(parseUrl("https://open.spotify.com/album/abc123")).toBeNull()
		})

		it("rejects artist URLs", () => {
			expect(parseUrl("https://open.spotify.com/artist/abc123")).toBeNull()
		})
	})

	describe("Discogs", () => {
		it("parses release URLs", () => {
			expect(parseUrl("https://www.discogs.com/release/12345")).toEqual({
				provider: "discogs",
				id: "12345",
			})
		})

		it("parses release URLs with slug", () => {
			expect(
				parseUrl("https://discogs.com/release/12345-Artist-Album-Name"),
			).toEqual({
				provider: "discogs",
				id: "12345",
			})
		})

		it("parses master URLs", () => {
			expect(parseUrl("https://discogs.com/master/67890")).toEqual({
				provider: "discogs",
				id: "67890",
			})
		})

		it("parses URLs with locale prefix", () => {
			expect(
				parseUrl("https://www.discogs.com/de/release/12345-Artist-Album"),
			).toEqual({
				provider: "discogs",
				id: "12345",
			})
		})

		it("parses master URLs with locale", () => {
			expect(
				parseUrl("https://discogs.com/fr/master/67890-Artist-Album"),
			).toEqual({
				provider: "discogs",
				id: "67890",
			})
		})
	})

	describe("Edge cases", () => {
		it("returns null for invalid URLs", () => {
			expect(parseUrl("not a url")).toBeNull()
		})

		it("returns null for unrecognized domains", () => {
			expect(parseUrl("https://example.com/watch?v=abc123")).toBeNull()
		})

		it("returns null for empty string", () => {
			expect(parseUrl("")).toBeNull()
		})

		it("handles URL-encoded characters", () => {
			expect(parseUrl("https://youtube.com/watch?v=abc%20123")).toEqual({
				provider: "youtube",
				id: "abc 123",
			})
		})
	})

	describe("r4 tracks bulk validation", () => {
		// 97% achievable with current providers (YouTube, Vimeo, Spotify, Discogs)
		// SoundCloud (~2.2%) not implemented - would need new spec
		it("parses 97% of track URLs to valid media IDs", () => {
			const results = r4Tracks.map((track) => {
				const parsed = parseUrl(track.url)
				return {
					url: track.url,
					parsed,
					valid: parsed !== null && parsed.id.length > 0,
				}
			})

			const valid = results.filter((r) => r.valid)
			const invalid = results.filter((r) => !r.valid)
			const percentage = (valid.length / results.length) * 100

			console.log(
				`Valid: ${valid.length}/${results.length} (${percentage.toFixed(2)}%)`,
			)
			if (invalid.length > 0) {
				console.log(
					"Sample invalid URLs:",
					invalid.slice(0, 10).map((r) => r.url),
				)
			}

			expect(percentage).toBeGreaterThanOrEqual(97)
		})
	})
})
