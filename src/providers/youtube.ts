/**
 * YouTube provider - fetch video metadata without API key
 */

import { MediaNotFoundError, ProviderError } from '../errors'
import type { SearchResult, YouTubeResult } from '../types'

/** YouTube oEmbed API response */
interface OEmbedResponse {
	title: string
	author_name: string
	author_url: string
	thumbnail_url: string
	thumbnail_width: number
	thumbnail_height: number
	html: string
	width: number
	height: number
	version: string
	provider_name: string
	provider_url: string
	type: string
}

/** YouTubei search API response structure */
interface YouTubeiResponse {
	contents?: {
		twoColumnSearchResultsRenderer?: {
			primaryContents?: {
				sectionListRenderer?: {
					contents?: Array<{
						itemSectionRenderer?: {
							contents?: Array<{
								videoRenderer?: {
									videoId: string
									title: { runs: Array<{ text: string }> }
									thumbnail: { thumbnails: Array<{ url: string }> }
								}
							}>
						}
					}>
				}
			}
		}
	}
}

/** Watch page enrichment fields */
interface WatchPageData {
	song?: string
	artist?: string
	album?: string
	thumbnailAlbum?: string
	channel?: string
	publishDate?: string
}

/** Extract a JSON variable assignment from YouTube HTML via brace-counting */
export function parseEmbeddedJson(
	html: string,
	varName: string,
): unknown | null {
	const prefix = `var ${varName} = `
	const start = html.indexOf(prefix)
	if (start === -1) return null
	const jsonStart = start + prefix.length
	let depth = 0
	let i = jsonStart
	for (; i < html.length; i++) {
		if (html[i] === '{') depth++
		else if (html[i] === '}') {
			depth--
			if (depth === 0) break
		}
	}
	try {
		return JSON.parse(html.slice(jsonStart, i + 1))
	} catch {
		return null
	}
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Extract music card data from ytInitialData engagement panels */
export function extractMusicCard(ytData: any): {
	song: string
	artist: string
	album?: string
	thumbnailAlbum?: string
} | null {
	const panels = ytData?.engagementPanels ?? []
	for (const panel of panels) {
		const items =
			panel?.engagementPanelSectionListRenderer?.content
				?.structuredDescriptionContentRenderer?.items
		if (!items) continue
		for (const item of items) {
			if (!item.horizontalCardListRenderer) continue
			const hcl = item.horizontalCardListRenderer
			const header =
				hcl?.header?.richListHeaderRenderer?.title?.simpleText
			if (header !== 'Music') continue
			const vm = hcl?.cards?.[0]?.videoAttributeViewModel
			if (!vm?.title || !vm?.subtitle) return null
			return {
				song: vm.title,
				artist: vm.subtitle,
				album: vm.secondarySubtitle?.content,
				thumbnailAlbum: vm.image?.sources?.[0]?.url,
			}
		}
	}
	return null
}

/** Extract description header (channel, publish date) from ytInitialData */
export function extractDescHeader(ytData: any): {
	channel?: string
	publishDate?: string
} | null {
	const panels = ytData?.engagementPanels ?? []
	for (const panel of panels) {
		const items =
			panel?.engagementPanelSectionListRenderer?.content
				?.structuredDescriptionContentRenderer?.items
		if (!items) continue
		for (const item of items) {
			if (!item.videoDescriptionHeaderRenderer) continue
			const hdr = item.videoDescriptionHeaderRenderer
			return {
				channel: hdr?.channel?.simpleText,
				publishDate: hdr?.publishDate?.simpleText,
			}
		}
	}
	return null
}

/** Fetch and parse YouTube watch page for enrichment data */
async function fetchWatchPage(id: string): Promise<WatchPageData> {
	try {
		const response = await globalThis.fetch(buildVideoUrl(id), {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
				'Accept-Language': 'en-US,en;q=0.9',
			},
		})
		if (!response.ok) return {}
		const html = await response.text()

		const ytData = parseEmbeddedJson(html, 'ytInitialData')
		if (!ytData) return {}

		const music = extractMusicCard(ytData)
		const desc = extractDescHeader(ytData)

		return {
			...(music && {
				song: music.song,
				artist: music.artist,
				album: music.album,
				thumbnailAlbum: music.thumbnailAlbum,
			}),
			...(desc && {
				channel: desc.channel,
				publishDate: desc.publishDate,
			}),
		}
	} catch {
		return {}
	}
}

const OEMBED_URL = 'https://www.youtube.com/oembed'
const YOUTUBEI_URL = 'https://www.youtube.com/youtubei/v1/search'
const YOUTUBEI_KEY = 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8'

/** Build YouTube video URL from ID */
const buildVideoUrl = (id: string): string =>
	`https://www.youtube.com/watch?v=${id}`

/** Fetch YouTube video metadata via oEmbed */
export const fetch = async (id: string): Promise<YouTubeResult> => {
	const url = `${OEMBED_URL}?url=${encodeURIComponent(buildVideoUrl(id))}&format=json`

	const response = await globalThis.fetch(url).catch((error) => {
		throw new ProviderError('youtube', `Network error: ${error.message}`)
	})

	if (response.status === 404 || response.status === 400) {
		throw new MediaNotFoundError('youtube', id)
	}

	if (!response.ok) {
		throw new ProviderError(
			'youtube',
			`HTTP ${response.status}: ${response.statusText}`,
		)
	}

	const payload = (await response.json()) as OEmbedResponse

	return {
		provider: 'youtube',
		id,
		url: buildVideoUrl(id),
		title: payload.title,
		thumbnail: payload.thumbnail_url,
		author: payload.author_name,
		payload,
	}
}

/** Fetch YouTube video metadata via oEmbed + watch page enrichment (slower) */
export const fetchExtended = async (id: string): Promise<YouTubeResult> => {
	const [base, watchData] = await Promise.all([
		fetch(id),
		fetchWatchPage(id),
	])

	return { ...base, ...watchData }
}

/** Search YouTube videos via youtubei endpoint */
export const search = async (query: string): Promise<SearchResult[]> => {
	const url = `${YOUTUBEI_URL}?key=${YOUTUBEI_KEY}`

	const response = await globalThis
		.fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query,
				context: {
					client: {
						clientName: 'WEB',
						clientVersion: '2.20230101',
					},
				},
			}),
		})
		.catch((error) => {
			throw new ProviderError('youtube', `Network error: ${error.message}`)
		})

	if (!response.ok) {
		throw new ProviderError(
			'youtube',
			`HTTP ${response.status}: ${response.statusText}`,
		)
	}

	const payload = (await response.json()) as YouTubeiResponse

	const contents =
		payload.contents?.twoColumnSearchResultsRenderer?.primaryContents
			?.sectionListRenderer?.contents ?? []

	const results: SearchResult[] = contents
		.flatMap((section) => section.itemSectionRenderer?.contents ?? [])
		.filter(
			(
				item,
			): item is { videoRenderer: NonNullable<typeof item.videoRenderer> } =>
				item.videoRenderer !== undefined,
		)
		.map((item) => {
			const video = item.videoRenderer
			return {
				provider: 'youtube' as const,
				id: video.videoId,
				title: video.title.runs.map((r) => r.text).join(''),
				thumbnail: video.thumbnail.thumbnails[0]?.url,
				url: buildVideoUrl(video.videoId),
			}
		})

	return results
}

export const youtube = { fetch, fetchExtended, search }

/**
 * regex from yt-dlp: (?P<id>[0-9A-Za-z_-]{{11}})
 * function from r4-sync-tests
 *
export function extractYouTubeId(url) {
	const patterns = [
		/(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/
	]
	for (const pattern of patterns) {
		const match = url.match(pattern)
		if (match) return match[1]
	}
	return null
}
*/
