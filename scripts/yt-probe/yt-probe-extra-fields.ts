/**
 * Check for year/date/duration fields across card, credits, videoDetails, microformat
 */

const testIds = [
	{ id: 'dQw4w9WgXcQ', label: 'Rick Astley (official)' },
	{ id: 'eNmVCcqLvH0', label: 'Snoh Aalegra (Topic)' },
	{ id: 'PKXloFW_ZCA', label: 'Gorillaz (official)' },
	{ id: '9bZkp7q19f0', label: 'PSY (official)' },
]

function parseJson(html: string, varName: string) {
	const start = html.indexOf(`var ${varName} = `)
	if (start === -1) return null
	const jsonStart = start + `var ${varName} = `.length
	let depth = 0, i = jsonStart
	for (; i < html.length; i++) {
		if (html[i] === '{') depth++
		else if (html[i] === '}') { depth--; if (depth === 0) break }
	}
	return JSON.parse(html.slice(jsonStart, i + 1))
}

for (const { id, label } of testIds) {
	console.log(`\n--- ${label} (${id}) ---`)

	const res = await fetch(`https://www.youtube.com/watch?v=${id}`, {
		headers: {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
			'Accept-Language': 'en-US,en;q=0.9',
		},
	})
	const html = await res.text()

	const ytData = parseJson(html, 'ytInitialData')
	const ytPlayer = parseJson(html, 'ytInitialPlayerResponse')

	// videoDetails
	const vd = ytPlayer?.videoDetails
	if (vd) {
		console.log('  videoDetails.lengthSeconds:', vd.lengthSeconds)
		console.log('  videoDetails.musicVideoType:', vd.musicVideoType)
	}

	// microformat
	const mf = ytPlayer?.microformat?.playerMicroformatRenderer
	if (mf) {
		console.log('  microformat.category:', mf.category)
		console.log('  microformat.publishDate:', mf.publishDate)
		console.log('  microformat.uploadDate:', mf.uploadDate)
		console.log('  microformat.lengthSeconds:', mf.lengthSeconds)
	}

	// description header factoids (often has year)
	const panels = ytData?.engagementPanels ?? []
	for (const panel of panels) {
		const items = panel?.engagementPanelSectionListRenderer
			?.content?.structuredDescriptionContentRenderer?.items
		if (!items) continue
		for (const item of items) {
			if (item.videoDescriptionHeaderRenderer) {
				const hdr = item.videoDescriptionHeaderRenderer
				// publishDate in header
				const dateText = hdr?.publishDate?.simpleText
				console.log('  descHeader.publishDate:', dateText)
				// factoids
				if (hdr?.factoid) {
					for (const f of hdr.factoid) {
						const fr = f?.factoidRenderer
						if (fr) {
							console.log(`  factoid: ${fr.value?.simpleText} ${fr.label?.simpleText}`)
						}
					}
				}
			}
		}
	}

	await new Promise(r => setTimeout(r, 800))
}
