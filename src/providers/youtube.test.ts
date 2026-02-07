import { describe, expect, it } from 'vitest'
import {
	extractDescHeader,
	extractMusicCard,
	parseEmbeddedJson,
	fetchExtended,
} from './youtube'

describe('parseEmbeddedJson', () => {
	it('extracts a JSON object from a var assignment', () => {
		const html = 'var ytInitialData = {"key":"value"};'
		const result = parseEmbeddedJson(html, 'ytInitialData') as any
		expect(result).toEqual({ key: 'value' })
	})

	it('handles nested objects', () => {
		const html = 'var ytInitialData = {"a":{"b":{"c":1}}};'
		const result = parseEmbeddedJson(html, 'ytInitialData') as any
		expect(result).toEqual({ a: { b: { c: 1 } } })
	})

	it('returns null when variable not found', () => {
		const html = 'var otherVar = {"key":"value"};'
		expect(parseEmbeddedJson(html, 'ytInitialData')).toBeNull()
	})

	it('returns null on invalid JSON', () => {
		const html = 'var ytInitialData = {invalid json};'
		expect(parseEmbeddedJson(html, 'ytInitialData')).toBeNull()
	})

	it('handles surrounding HTML content', () => {
		const html =
			'<script>var foo = 1; var ytInitialData = {"ok":true}; var bar = 2;</script>'
		const result = parseEmbeddedJson(html, 'ytInitialData') as any
		expect(result).toEqual({ ok: true })
	})
})

describe('extractMusicCard', () => {
	it('extracts song, artist, album from music card structure', () => {
		const ytData = {
			engagementPanels: [
				{
					engagementPanelSectionListRenderer: {
						content: {
							structuredDescriptionContentRenderer: {
								items: [
									{
										horizontalCardListRenderer: {
											header: {
												richListHeaderRenderer: {
													title: { simpleText: 'Music' },
												},
											},
											cards: [
												{
													videoAttributeViewModel: {
														title: 'Never Gonna Give You Up',
														subtitle: 'Rick Astley',
														secondarySubtitle: {
															content: 'Whenever You Need Somebody',
														},
														image: {
															sources: [
																{
																	url: 'https://lh3.googleusercontent.com/album-art',
																},
															],
														},
													},
												},
											],
										},
									},
								],
							},
						},
					},
				},
			],
		}

		const result = extractMusicCard(ytData)
		expect(result).toEqual({
			song: 'Never Gonna Give You Up',
			artist: 'Rick Astley',
			album: 'Whenever You Need Somebody',
			thumbnailAlbum: 'https://lh3.googleusercontent.com/album-art',
		})
	})

	it('returns null when no music card exists', () => {
		const ytData = { engagementPanels: [] }
		expect(extractMusicCard(ytData)).toBeNull()
	})

	it('returns null when header is not Music', () => {
		const ytData = {
			engagementPanels: [
				{
					engagementPanelSectionListRenderer: {
						content: {
							structuredDescriptionContentRenderer: {
								items: [
									{
										horizontalCardListRenderer: {
											header: {
												richListHeaderRenderer: {
													title: { simpleText: 'Other' },
												},
											},
											cards: [],
										},
									},
								],
							},
						},
					},
				},
			],
		}
		expect(extractMusicCard(ytData)).toBeNull()
	})

	it('returns null when card has no title/subtitle', () => {
		const ytData = {
			engagementPanels: [
				{
					engagementPanelSectionListRenderer: {
						content: {
							structuredDescriptionContentRenderer: {
								items: [
									{
										horizontalCardListRenderer: {
											header: {
												richListHeaderRenderer: {
													title: { simpleText: 'Music' },
												},
											},
											cards: [{ videoAttributeViewModel: {} }],
										},
									},
								],
							},
						},
					},
				},
			],
		}
		expect(extractMusicCard(ytData)).toBeNull()
	})

	it('handles missing album and thumbnailAlbum', () => {
		const ytData = {
			engagementPanels: [
				{
					engagementPanelSectionListRenderer: {
						content: {
							structuredDescriptionContentRenderer: {
								items: [
									{
										horizontalCardListRenderer: {
											header: {
												richListHeaderRenderer: {
													title: { simpleText: 'Music' },
												},
											},
											cards: [
												{
													videoAttributeViewModel: {
														title: 'Song Title',
														subtitle: 'Artist Name',
													},
												},
											],
										},
									},
								],
							},
						},
					},
				},
			],
		}

		const result = extractMusicCard(ytData)
		expect(result).toEqual({
			song: 'Song Title',
			artist: 'Artist Name',
			album: undefined,
			thumbnailAlbum: undefined,
		})
	})
})

describe('extractDescHeader', () => {
	it('extracts channel and publishDate', () => {
		const ytData = {
			engagementPanels: [
				{
					engagementPanelSectionListRenderer: {
						content: {
							structuredDescriptionContentRenderer: {
								items: [
									{
										videoDescriptionHeaderRenderer: {
											channel: { simpleText: 'Rick Astley' },
											publishDate: { simpleText: 'Oct 25, 2009' },
										},
									},
								],
							},
						},
					},
				},
			],
		}

		const result = extractDescHeader(ytData)
		expect(result).toEqual({
			channel: 'Rick Astley',
			publishDate: 'Oct 25, 2009',
		})
	})

	it('returns null when no desc header exists', () => {
		const ytData = { engagementPanels: [] }
		expect(extractDescHeader(ytData)).toBeNull()
	})
})

describe('fetch (integration)', { timeout: 15000 }, () => {
	it('returns enriched result for Rick Astley - Never Gonna Give You Up', async () => {
		const result = await fetchExtended('dQw4w9WgXcQ')

		// oEmbed fields always present
		expect(result.provider).toBe('youtube')
		expect(result.id).toBe('dQw4w9WgXcQ')
		expect(result.title).toContain('Never Gonna Give You Up')
		expect(result.author).toBeDefined()
		expect(result.thumbnail).toBeDefined()

		// watch page enrichment — music card
		expect(result.song).toContain('Never Gonna Give You Up')
		expect(result.artist).toBe('Rick Astley')
		expect(result.album).toBeDefined()
		expect(result.thumbnailAlbum).toBeDefined()

		// watch page enrichment — desc header
		expect(result.channel).toBeDefined()
		expect(result.publishDate).toBeDefined()
	})
})
