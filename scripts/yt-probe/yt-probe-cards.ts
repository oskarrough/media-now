/**
 * Dump the horizontalCardListRenderer and other structured description items
 * to see where YouTube now puts music metadata.
 */

const testIds = [
	{ id: 'eNmVCcqLvH0', label: 'Snoh Aalegra - Time (Topic)' },
	{ id: 'dQw4w9WgXcQ', label: 'Rick Astley - NGGYU (official)' },
	{ id: 'kJQP7kiw5Fk', label: 'Despacito (official)' },
	{ id: 'PKXloFW_ZCA', label: 'User test URL' },
]

for (const { id, label } of testIds) {
	console.log(`\n${'='.repeat(60)}`)
	console.log(`${label} (${id})`)
	console.log('='.repeat(60))

	const res = await fetch(`https://www.youtube.com/watch?v=${id}`, {
		headers: {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
			'Accept-Language': 'en-US,en;q=0.9',
		},
	})
	const html = await res.text()

	// Parse ytInitialData with brace-counting
	const dataStart = html.indexOf('var ytInitialData = ')
	if (dataStart === -1) { console.log('  no ytInitialData'); continue }
	const jsonStart = dataStart + 'var ytInitialData = '.length
	let depth = 0, i = jsonStart
	for (; i < html.length; i++) {
		if (html[i] === '{') depth++
		else if (html[i] === '}') { depth--; if (depth === 0) break }
	}
	const ytData = JSON.parse(html.slice(jsonStart, i + 1))

	// Find the structured description panel
	const panels = ytData?.engagementPanels ?? []
	for (const panel of panels) {
		const renderer = panel?.engagementPanelSectionListRenderer
		const structured = renderer?.content?.structuredDescriptionContentRenderer
		if (!structured) continue

		const items = structured.items ?? []
		for (const item of items) {
			const key = Object.keys(item)[0]

			if (key === 'horizontalCardListRenderer') {
				const cards = item.horizontalCardListRenderer
				console.log('\n  horizontalCardListRenderer:')
				console.log(`    header: ${JSON.stringify(cards?.header?.richListHeaderRenderer?.title?.simpleText ?? cards?.header)}`)

				// Dump cards
				for (const [ci, card] of (cards?.cards ?? []).entries()) {
					const vc = card?.videoAttributeViewModel
					if (vc) {
						console.log(`    card[${ci}] videoAttributeViewModel:`)
						console.log(`      title: ${vc.title}`)
						console.log(`      subtitle: ${vc.subtitle}`)
						console.log(`      secondarySubtitle: ${JSON.stringify(vc.secondarySubtitle)}`)
						console.log(`      orientation: ${vc.orientation}`)
						// Check for onTap/endpoint
						const endpoint = vc.onTap?.innertubeCommand?.browseEndpoint ?? vc.onTap?.innertubeCommand?.watchEndpoint
						if (endpoint) console.log(`      endpoint: ${JSON.stringify(endpoint)}`)
					} else {
						console.log(`    card[${ci}]: ${JSON.stringify(Object.keys(card))}`)
					}
				}

				// Write full structure for inspection
				await Bun.write(`yt-cards-${id}.json`, JSON.stringify(cards, null, 2))
				console.log(`    Full cards written to yt-cards-${id}.json`)
			}

			if (key === 'videoDescriptionHeaderRenderer') {
				const hdr = item.videoDescriptionHeaderRenderer
				console.log('\n  videoDescriptionHeaderRenderer:')
				console.log(`    title: ${hdr?.title?.runs?.map((r: any) => r.text).join('')}`)
				console.log(`    channel: ${hdr?.channel?.simpleText}`)
				console.log(`    channelNavigationEndpoint: ${JSON.stringify(hdr?.channelNavigationEndpoint?.browseEndpoint)}`)
				// Check for music-specific fields
				if (hdr?.factoid) {
					console.log(`    factoids:`)
					for (const f of hdr.factoid) {
						const fvm = f?.factoidRenderer ?? f?.viewCountFactoidRenderer
						if (fvm) console.log(`      ${fvm?.value?.simpleText ?? JSON.stringify(fvm)}`)
					}
				}
			}
		}
	}

	// Also check microformat in playerResponse for music metadata
	const playerStart = html.indexOf('var ytInitialPlayerResponse = ')
	if (playerStart !== -1) {
		const pJsonStart = playerStart + 'var ytInitialPlayerResponse = '.length
		let pd = 0, pi = pJsonStart
		for (; pi < html.length; pi++) {
			if (html[pi] === '{') pd++
			else if (html[pi] === '}') { pd--; if (pd === 0) break }
		}
		const ytPlayer = JSON.parse(html.slice(pJsonStart, pi + 1))

		// microformat often has music info
		const mf = ytPlayer?.microformat?.playerMicroformatRenderer
		if (mf) {
			console.log('\n  microformat:')
			console.log(`    title: ${mf.title?.simpleText}`)
			console.log(`    ownerChannelName: ${mf.ownerChannelName}`)
			console.log(`    category: ${mf.category}`)
			console.log(`    publishDate: ${mf.publishDate}`)
			console.log(`    lengthSeconds: ${mf.lengthSeconds}`)
			console.log(`    isFamilySafe: ${mf.isFamilySafe}`)
			console.log(`    hasYpcMetadata: ${mf.hasYpcMetadata}`)
			console.log(`    availableCountries count: ${mf.availableCountries?.length}`)
			if (mf.externalChannelId) console.log(`    externalChannelId: ${mf.externalChannelId}`)
		}

		// videoDetails.musicVideoType
		const vd = ytPlayer?.videoDetails
		if (vd?.musicVideoType) {
			console.log(`\n  musicVideoType: ${vd.musicVideoType}`)
		}
	}

	await new Promise(r => setTimeout(r, 1000))
}
