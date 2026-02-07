/**
 * Fetch 50 ko002 tracks, scrape watch pages, store everything.
 */

import tracks from './yt-test-tracks-50.json'

function parseJson(html: string, varName: string) {
	const start = html.indexOf(`var ${varName} = `)
	if (start === -1) return null
	const jsonStart = start + `var ${varName} = `.length
	let depth = 0, i = jsonStart
	for (; i < html.length; i++) {
		if (html[i] === '{') depth++
		else if (html[i] === '}') { depth--; if (depth === 0) break }
	}
	try { return JSON.parse(html.slice(jsonStart, i + 1)) } catch { return null }
}

function extractMusicCard(ytData: any) {
	const panels = ytData?.engagementPanels ?? []
	for (const panel of panels) {
		const items = panel?.engagementPanelSectionListRenderer
			?.content?.structuredDescriptionContentRenderer?.items
		if (!items) continue
		for (const item of items) {
			if (!item.horizontalCardListRenderer) continue
			const hcl = item.horizontalCardListRenderer
			const header = hcl?.header?.richListHeaderRenderer?.title?.simpleText
			if (header !== 'Music') continue
			return hcl
		}
	}
	return null
}

function extractCreditsDialog(card: any) {
	const vm = card?.cards?.[0]?.videoAttributeViewModel
	if (!vm) return null
	const dialog = vm.overflowMenuOnTap?.innertubeCommand
		?.confirmDialogEndpoint?.content?.confirmDialogRenderer
	if (!dialog?.dialogMessages?.[0]?.runs) return null
	const runs = dialog.dialogMessages[0].runs
	const credits: Record<string, string> = {}
	let currentKey: string | null = null
	for (const run of runs) {
		const text = run.text?.trim()
		if (!text || text === '\n\n') continue
		if (run.bold && text !== ':') {
			currentKey = text.replace(/:$/, '')
		} else if (currentKey && text !== ':') {
			credits[currentKey] = (credits[currentKey] ? credits[currentKey] + text : text)
		}
	}
	return Object.keys(credits).length ? credits : null
}

function extractDescHeader(ytData: any) {
	const panels = ytData?.engagementPanels ?? []
	for (const panel of panels) {
		const items = panel?.engagementPanelSectionListRenderer
			?.content?.structuredDescriptionContentRenderer?.items
		if (!items) continue
		for (const item of items) {
			if (!item.videoDescriptionHeaderRenderer) continue
			const hdr = item.videoDescriptionHeaderRenderer
			return {
				title: hdr?.title?.runs?.map((r: any) => r.text).join(''),
				channel: hdr?.channel?.simpleText,
				publishDate: hdr?.publishDate?.simpleText,
				factoids: (hdr?.factoid ?? []).map((f: any) => {
					const fr = f?.factoidRenderer
					return fr ? { value: fr.value?.simpleText, label: fr.label?.simpleText } : null
				}).filter(Boolean),
			}
		}
	}
	return null
}

const results = []
let i = 0

for (const track of tracks) {
	i++
	const videoId = track.media_id
	console.log(`[${i}/${tracks.length}] ${track.title} (${videoId})`)

	try {
		const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
				'Accept-Language': 'en-US,en;q=0.9',
			},
		})
		const html = await res.text()

		const ytData = parseJson(html, 'ytInitialData')
		const ytPlayer = parseJson(html, 'ytInitialPlayerResponse')

		const musicCard = extractMusicCard(ytData)
		const vm = musicCard?.cards?.[0]?.videoAttributeViewModel
		const credits = extractCreditsDialog(musicCard)
		const descHeader = extractDescHeader(ytData)
		const vd = ytPlayer?.videoDetails
		const mf = ytPlayer?.microformat?.playerMicroformatRenderer

		results.push({
			r4_title: track.title,
			r4_discogs: track.discogs_url,
			r4_tags: track.tags,
			videoId,
			card: vm ? {
				song: vm.title,
				artist: vm.subtitle,
				album: vm.secondarySubtitle?.content,
				albumArt: vm.image?.sources?.[0]?.url,
			} : null,
			credits,
			descHeader,
			videoDetails: vd ? {
				title: vd.title,
				author: vd.author,
				channelId: vd.channelId,
				lengthSeconds: vd.lengthSeconds,
				musicVideoType: vd.musicVideoType,
			} : null,
			microformat: mf ? {
				category: mf.category,
				publishDate: mf.publishDate,
				lengthSeconds: mf.lengthSeconds,
				ownerChannelName: mf.ownerChannelName,
			} : null,
		})

		const status = vm ? `song=${vm.title} artist=${vm.subtitle}` : 'no music card'
		console.log(`  ${status}`)
	} catch (e: any) {
		console.log(`  ERROR: ${e.message}`)
		results.push({ r4_title: track.title, videoId, error: e.message })
	}

	await new Promise(r => setTimeout(r, 600))
}

await Bun.write('yt-dump-50.json', JSON.stringify(results, null, 2))
console.log(`\nDone. ${results.length} results written to yt-dump-50.json`)
