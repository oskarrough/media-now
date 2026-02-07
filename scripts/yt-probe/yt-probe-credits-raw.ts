/**
 * Dump the raw "Song credits" dialog and music card for various video types
 * to see exactly what fields YouTube provides.
 */

const testIds = [
	{ id: 'eNmVCcqLvH0', label: 'Snoh Aalegra - Time (Topic channel)' },
	{ id: 'Mjl20hza484', label: 'Samurai Breaks - Casio Crew (Topic)' },
	{ id: 'dQw4w9WgXcQ', label: 'Rick Astley - NGGYU (official)' },
	{ id: 'kJQP7kiw5Fk', label: 'Despacito (official)' },
	{ id: 'PKXloFW_ZCA', label: 'Gorillaz - Aries' },
	{ id: 'VZ94gQQcVRo', label: 'Boo Williams - Teckno Drome (Topic)' },
	{ id: '2QZxRkPN14w', label: 'Joy Orbison - Hyph Mngo (Topic)' },
	{ id: 'oqzfbwcVqvc', label: 'Mount Rushmore - user upload' },
	{ id: 'NDdMveBbBUo', label: 'Livin Large - user upload' },
	{ id: 'iu5rnQkfO6M', label: 'Switch Angel - coding trance (not music)' },
	// bonus: a podcast, a live stream
	{ id: '9bZkp7q19f0', label: 'PSY - Gangnam Style' },
]

function parseYtInitialData(html: string) {
	const start = html.indexOf('var ytInitialData = ')
	if (start === -1) return null
	const jsonStart = start + 'var ytInitialData = '.length
	let depth = 0, i = jsonStart
	for (; i < html.length; i++) {
		if (html[i] === '{') depth++
		else if (html[i] === '}') { depth--; if (depth === 0) break }
	}
	return JSON.parse(html.slice(jsonStart, i + 1))
}

const allResults: Record<string, any> = {}

for (const { id, label } of testIds) {
	console.log(`\n--- ${label} (${id}) ---`)

	const res = await fetch(`https://www.youtube.com/watch?v=${id}`, {
		headers: {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
			'Accept-Language': 'en-US,en;q=0.9',
		},
	})
	const html = await res.text()
	const ytData = parseYtInitialData(html)
	if (!ytData) { console.log('  no ytInitialData'); continue }

	const panels = ytData?.engagementPanels ?? []
	let cardData: any = null
	let creditsRuns: any = null

	for (const panel of panels) {
		const items = panel?.engagementPanelSectionListRenderer
			?.content?.structuredDescriptionContentRenderer?.items
		if (!items) continue

		for (const item of items) {
			if (!item.horizontalCardListRenderer) continue
			const hcl = item.horizontalCardListRenderer
			const header = hcl?.header?.richListHeaderRenderer?.title?.simpleText
			if (header !== 'Music') continue

			for (const card of hcl.cards ?? []) {
				const vm = card.videoAttributeViewModel
				if (!vm) continue

				cardData = {
					title: vm.title,
					subtitle: vm.subtitle,
					secondarySubtitle: vm.secondarySubtitle?.content,
					albumArt: vm.image?.sources?.[0]?.url,
					playlistId: null as string | null,
				}

				// Check for playlist endpoint in secondarySubtitle
				const cmdRuns = vm.secondarySubtitle?.commandRuns
				if (cmdRuns?.[0]) {
					const endpoint = cmdRuns[0]?.onTap?.innertubeCommand?.watchPlaylistEndpoint
					if (endpoint) cardData.playlistId = endpoint.playlistId
				}

				// Extract credits dialog
				const dialog = vm.overflowMenuOnTap?.innertubeCommand
					?.confirmDialogEndpoint?.content?.confirmDialogRenderer
				if (dialog?.dialogMessages?.[0]?.runs) {
					const runs = dialog.dialogMessages[0].runs
					// Parse bold key / value pairs
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
					creditsRuns = credits
				}
			}
		}
	}

	const result = { card: cardData, credits: creditsRuns }
	allResults[`${id} ${label}`] = result

	if (cardData) {
		console.log('  card:', JSON.stringify(cardData))
	} else {
		console.log('  card: (none)')
	}
	if (creditsRuns) {
		console.log('  credits:', JSON.stringify(creditsRuns))
	} else {
		console.log('  credits: (none)')
	}

	await new Promise(r => setTimeout(r, 800))
}

await Bun.write('yt-credits-raw.json', JSON.stringify(allResults, null, 2))
console.log('\nWrote yt-credits-raw.json')
