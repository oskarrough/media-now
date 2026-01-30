/**
 * YouTube provider - fetch video metadata without API key
 */

import { MediaNotFoundError, ProviderError } from "../errors"
import type { SearchResult, YouTubeResult } from "../types"

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

const OEMBED_URL = "https://www.youtube.com/oembed"
const YOUTUBEI_URL = "https://www.youtube.com/youtubei/v1/search"
const YOUTUBEI_KEY = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"

/** Build YouTube video URL from ID */
const buildVideoUrl = (id: string): string =>
	`https://www.youtube.com/watch?v=${id}`

/** Fetch YouTube video metadata via oEmbed */
export const get = async (id: string): Promise<YouTubeResult> => {
	const url = `${OEMBED_URL}?url=${encodeURIComponent(buildVideoUrl(id))}&format=json`

	const response = await fetch(url).catch((error) => {
		throw new ProviderError("youtube", `Network error: ${error.message}`)
	})

	if (response.status === 404 || response.status === 400) {
		throw new MediaNotFoundError("youtube", id)
	}

	if (!response.ok) {
		throw new ProviderError(
			"youtube",
			`HTTP ${response.status}: ${response.statusText}`,
		)
	}

	const payload = (await response.json()) as OEmbedResponse

	return {
		provider: "youtube",
		id,
		url: buildVideoUrl(id),
		title: payload.title,
		thumbnail: payload.thumbnail_url,
		author: payload.author_name,
		payload,
	}
}

/** Search YouTube videos via youtubei endpoint */
export const search = async (query: string): Promise<SearchResult[]> => {
	const url = `${YOUTUBEI_URL}?key=${YOUTUBEI_KEY}`

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query,
			context: {
				client: {
					clientName: "WEB",
					clientVersion: "2.20230101",
				},
			},
		}),
	}).catch((error) => {
		throw new ProviderError("youtube", `Network error: ${error.message}`)
	})

	if (!response.ok) {
		throw new ProviderError(
			"youtube",
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
				provider: "youtube" as const,
				id: video.videoId,
				title: video.title.runs.map((r) => r.text).join(""),
				thumbnail: video.thumbnail.thumbnails[0]?.url,
				url: buildVideoUrl(video.videoId),
			}
		})

	return results
}

export const youtube = { get, search }
