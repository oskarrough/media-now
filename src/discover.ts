/**
 * Discovery chain - discover Discogs URL for a track via MusicBrainz
 */

import { fetchRecording, fetchRelease, search } from "./providers/musicbrainz"

/**
 * Discover a Discogs URL for a track title via MusicBrainz.
 *
 * Data flow:
 * 1. Search MusicBrainz for recordings matching the title
 * 2. Get full recording data including releases
 * 3. For each release, fetch URL relationships
 * 4. Return first discogs.com URL found (or null)
 *
 * @param title - Track title (e.g., "Artist - Song Name")
 * @returns Discogs URL if found, null otherwise
 * @throws ProviderError on network/API errors
 */
export const discoverDiscogsUrl = async (
	title: string,
): Promise<string | null> => {
	// 1. Search MusicBrainz for recordings
	const recordings = await search(title)
	if (recordings.length === 0) return null

	// Take first recording result
	const recording = recordings[0]

	// 2. Get full recording data with releases
	const fullRecording = await fetchRecording(recording.id)

	// Extract release IDs from payload (raw MB data has IDs)
	const payload = fullRecording.payload as { releases?: { id: string }[] }
	const releaseIds = payload.releases?.map((r) => r.id) ?? []

	if (releaseIds.length === 0) return null

	// 3. For each release, fetch URL relationships and look for Discogs
	for (const releaseId of releaseIds) {
		const release = await fetchRelease(releaseId)

		// 4. Find first discogs.com URL in relations
		const discogsRelation = release.relations.find((rel) =>
			rel.url.includes("discogs.com"),
		)

		if (discogsRelation) {
			return discogsRelation.url
		}
	}

	// No Discogs URL found after exhausting all releases
	return null
}
