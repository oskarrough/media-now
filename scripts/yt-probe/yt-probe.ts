/**
 * Probes YouTube metadata from multiple sources for a list of test tracks.
 * Sources: oEmbed, ytInitialData (music shelf), ytInitialPlayerResponse, media-now getMedia
 */

import { getMedia } from '../../src/get-media.ts'
import { parseTitle, cleanTitle } from '../../src/parse-title.ts'
import tracks from './yt-test-tracks.json'

// --- 1. oEmbed ---
async function probeOembed(videoId: string) {
	const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
	const res = await fetch(url)
	if (!res.ok) return null
	return res.json()
}

// --- 2. ytInitialData (watch page HTML) ---
async function probeWatchPage(videoId: string) {
	const url = `https://www.youtube.com/watch?v=${videoId}`
	const res = await fetch(url, {
		headers: {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
			'Accept-Language': 'en-US,en;q=0.9',
		},
	})
	const html = await res.text()

	// Extract ytInitialData
	let ytInitialData: any = null
	const dataMatch = html.match(/var ytInitialData\s*=\s*({.+?});\s*<\/script>/)
	if (dataMatch) {
		try { ytInitialData = JSON.parse(dataMatch[1]) } catch {}
	}

	// Extract ytInitialPlayerResponse
	let ytPlayerResponse: any = null
	const playerMatch = html.match(/var ytInitialPlayerResponse\s*=\s*({.+?});\s*(?:var|<\/script>)/)
	if (playerMatch) {
		try { ytPlayerResponse = JSON.parse(playerMatch[1]) } catch {}
	}

	// Dig for music shelf in ytInitialData
	let musicInfo: Record<string, string> | null = null
	if (ytInitialData) {
		const panels = ytInitialData?.engagementPanels ?? []
		for (const panel of panels) {
			const items = panel
				?.engagementPanelSectionListRenderer
				?.content
				?.structuredDescriptionContentRenderer
				?.items
			if (!items) continue
			const shelf = items.find((i: any) => i.videoDescriptionMusicSectionRenderer)
			if (shelf) {
				const lockups = shelf.videoDescriptionMusicSectionRenderer.carouselLockups ?? []
				for (const lockup of lockups) {
					const rows = lockup?.carouselLockupRenderer?.infoRows ?? []
					const info: Record<string, string> = {}
					for (const row of rows) {
						const r = row.infoRowRenderer
						const key = r?.infoRowHeaderRenderer?.content?.simpleText?.toLowerCase()
						const val = r?.defaultMetadata?.simpleText
							?? r?.defaultMetadata?.runs?.map((r: any) => r.text).join('')
						if (key && val) info[key] = val
					}
					if (Object.keys(info).length) musicInfo = info
				}
			}
		}
	}

	// Dig for videoDetails in playerResponse
	let videoDetails: any = null
	if (ytPlayerResponse) {
		videoDetails = ytPlayerResponse.videoDetails ?? null
	}

	return { musicInfo, videoDetails }
}

// --- 3. media-now getMedia ---
async function probeMediaNow(videoUrl: string) {
	try {
		const result = await getMedia(videoUrl)
		return result
	} catch (e: any) {
		return { error: e.message }
	}
}

// --- Run all probes ---
const results = []

for (const track of tracks) {
	const videoId = track.media_id
	const videoUrl = `https://www.youtube.com/watch?v=${videoId}`
	console.log(`\n=== ${track.title} (${videoId}) ===`)

	const [oembed, watchPage, mediaNow] = await Promise.all([
		probeOembed(videoId),
		probeWatchPage(videoId),
		probeMediaNow(videoUrl),
	])

	const parsed = parseTitle(cleanTitle(track.title))

	const entry = {
		r4: {
			title: track.title,
			discogs_url: track.discogs_url,
			tags: track.tags,
		},
		parsed_title: parsed,
		oembed: oembed ? { title: oembed.title, author_name: oembed.author_name, author_url: oembed.author_url } : null,
		yt_music_shelf: watchPage.musicInfo,
		yt_video_details: watchPage.videoDetails ? {
			title: watchPage.videoDetails.title,
			author: watchPage.videoDetails.author,
			channelId: watchPage.videoDetails.channelId,
			shortDescription: watchPage.videoDetails.shortDescription?.slice(0, 200),
			musicVideoType: watchPage.videoDetails.musicVideoType,
			lengthSeconds: watchPage.videoDetails.lengthSeconds,
		} : null,
		media_now_payload: mediaNow,
	}

	results.push(entry)

	// Quick summary
	console.log('  oEmbed title:', oembed?.title ?? '(none)')
	console.log('  oEmbed author:', oembed?.author_name ?? '(none)')
	console.log('  YT music shelf:', JSON.stringify(watchPage.musicInfo))
	console.log('  YT musicVideoType:', watchPage.videoDetails?.musicVideoType ?? '(none)')
	console.log('  parseTitle:', JSON.stringify(parsed))
	console.log('  media-now title:', (mediaNow as any)?.title ?? (mediaNow as any)?.error)

	// Small delay to avoid rate limiting
	await new Promise(r => setTimeout(r, 500))
}

// Write full results
await Bun.write('yt-probe-results.json', JSON.stringify(results, null, 2))
console.log(`\nDone. Wrote ${results.length} results to yt-probe-results.json`)
