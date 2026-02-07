/**
 * Debug: fetch a YouTube watch page and dump all the interesting JSON structures.
 * Tests with both a ko002 track AND a known mainstream music video.
 */

const testIds = [
	{ id: 'eNmVCcqLvH0', label: 'Snoh Aalegra - Time (Topic channel)' },
	{ id: 'Mjl20hza484', label: 'Samurai Breaks - Casio Crew (Topic channel)' },
	{ id: 'dQw4w9WgXcQ', label: 'Rick Astley - Never Gonna Give You Up (official, should have music shelf)' },
	{ id: 'kJQP7kiw5Fk', label: 'Luis Fonsi - Despacito (official, should have music shelf)' },
]

for (const { id, label } of testIds) {
	console.log(`\n${'='.repeat(60)}`)
	console.log(`${label} (${id})`)
	console.log('='.repeat(60))

	const url = `https://www.youtube.com/watch?v=${id}`
	const res = await fetch(url, {
		headers: {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
			'Accept-Language': 'en-US,en;q=0.9',
		},
	})
	const html = await res.text()

	// Check what regex patterns match
	const hasInitialData = /var ytInitialData/.test(html)
	const hasPlayerResponse = /var ytInitialPlayerResponse/.test(html)
	console.log(`  ytInitialData present: ${hasInitialData}`)
	console.log(`  ytInitialPlayerResponse present: ${hasPlayerResponse}`)

	// Try broader regex for ytInitialData
	let ytData: any = null
	// The JSON can be huge, try a different approach: find the start and parse
	const dataStart = html.indexOf('var ytInitialData = ')
	if (dataStart !== -1) {
		const jsonStart = dataStart + 'var ytInitialData = '.length
		// Find matching closing brace by counting
		let depth = 0, i = jsonStart
		for (; i < html.length && i < jsonStart + 5_000_000; i++) {
			if (html[i] === '{') depth++
			else if (html[i] === '}') { depth--; if (depth === 0) break }
		}
		try {
			ytData = JSON.parse(html.slice(jsonStart, i + 1))
			console.log(`  ytInitialData parsed: yes (${(i - jsonStart).toLocaleString()} chars)`)
		} catch (e: any) {
			console.log(`  ytInitialData parse error: ${e.message}`)
		}
	}

	// Same for player response
	let ytPlayer: any = null
	const playerStart = html.indexOf('var ytInitialPlayerResponse = ')
	if (playerStart !== -1) {
		const jsonStart = playerStart + 'var ytInitialPlayerResponse = '.length
		let depth = 0, i = jsonStart
		for (; i < html.length && i < jsonStart + 5_000_000; i++) {
			if (html[i] === '{') depth++
			else if (html[i] === '}') { depth--; if (depth === 0) break }
		}
		try {
			ytPlayer = JSON.parse(html.slice(jsonStart, i + 1))
			console.log(`  ytPlayerResponse parsed: yes`)
		} catch (e: any) {
			console.log(`  ytPlayerResponse parse error: ${e.message}`)
		}
	}

	// Look for music shelf in ytInitialData
	if (ytData) {
		const panels = ytData?.engagementPanels ?? []
		console.log(`  engagementPanels count: ${panels.length}`)
		for (const [idx, panel] of panels.entries()) {
			const renderer = panel?.engagementPanelSectionListRenderer
			const panelId = renderer?.panelIdentifier ?? 'unknown'
			console.log(`    panel[${idx}]: ${panelId}`)

			// Look for structured description
			const structured = renderer?.content?.structuredDescriptionContentRenderer
			if (structured) {
				const items = structured.items ?? []
				console.log(`      structuredDescription items: ${items.length}`)
				for (const item of items) {
					const keys = Object.keys(item)
					console.log(`        - ${keys.join(', ')}`)
					if (item.videoDescriptionMusicSectionRenderer) {
						const section = item.videoDescriptionMusicSectionRenderer
						console.log(`        MUSIC SECTION FOUND!`)
						// Dump the whole section
						await Bun.write(`yt-music-shelf-${id}.json`, JSON.stringify(section, null, 2))
						console.log(`        Written to yt-music-shelf-${id}.json`)

						// Try to extract
						const lockups = section.carouselLockups ?? []
						for (const lockup of lockups) {
							const rows = lockup?.carouselLockupRenderer?.infoRows ?? []
							for (const row of rows) {
								const r = row.infoRowRenderer
								const key = r?.infoRowHeaderRenderer?.content?.simpleText
								const val = r?.defaultMetadata?.simpleText
									?? r?.defaultMetadata?.runs?.map((r: any) => r.text).join('')
								if (key) console.log(`          ${key}: ${val}`)
							}
						}
					}
				}
			}
		}
	}

	// Look for videoDetails in player response
	if (ytPlayer?.videoDetails) {
		const vd = ytPlayer.videoDetails
		console.log(`  videoDetails.title: ${vd.title}`)
		console.log(`  videoDetails.author: ${vd.author}`)
		console.log(`  videoDetails.channelId: ${vd.channelId}`)
		console.log(`  videoDetails.musicVideoType: ${vd.musicVideoType ?? '(none)'}`)
		console.log(`  videoDetails.isLiveContent: ${vd.isLiveContent}`)
		console.log(`  videoDetails.shortDescription: ${vd.shortDescription?.slice(0, 300)}`)
	}

	await new Promise(r => setTimeout(r, 1000))
}
