/**
 * URL parsing - extract provider and ID from media URLs
 */

import type { Provider } from './types'

/** Result of parsing a media URL */
export interface ParsedUrl {
  provider: Provider
  id: string
}

/**
 * Parse a media URL and extract provider and ID
 * @param url - The URL to parse
 * @returns ParsedUrl if recognized, null otherwise
 */
export const parseUrl = (url: string): ParsedUrl | null => {
  try {
    const parsed = new URL(url)
    return (
      parseYouTube(parsed) ??
      parseVimeo(parsed) ??
      parseSpotify(parsed) ??
      parseDiscogs(parsed)
    )
  } catch {
    return null
  }
}

/**
 * Parse YouTube URLs
 * Patterns: watch?v=, youtu.be/, /embed/, /shorts/
 */
const parseYouTube = (url: URL): ParsedUrl | null => {
  const host = url.hostname.replace(/^www\./, '')

  // youtu.be/{id}
  if (host === 'youtu.be') {
    const id = url.pathname.slice(1).split('/')[0]
    return id ? { provider: 'youtube', id } : null
  }

  // youtube.com patterns
  if (host !== 'youtube.com') return null

  // watch?v={id}
  const watchId = url.searchParams.get('v')
  if (watchId) return { provider: 'youtube', id: watchId }

  // /embed/{id} or /shorts/{id}
  const match = url.pathname.match(/^\/(embed|shorts)\/([^/?]+)/)
  if (match?.[2]) return { provider: 'youtube', id: match[2] }

  return null
}

/**
 * Parse Vimeo URLs
 * Patterns: vimeo.com/{id}, /video/{id}, player embeds
 */
const parseVimeo = (url: URL): ParsedUrl | null => {
  const host = url.hostname.replace(/^www\./, '')

  // vimeo.com or player.vimeo.com
  if (host !== 'vimeo.com' && host !== 'player.vimeo.com') return null

  // /video/{id} (player embed)
  const videoMatch = url.pathname.match(/^\/video\/(\d+)/)
  if (videoMatch?.[1]) return { provider: 'vimeo', id: videoMatch[1] }

  // vimeo.com/{id} (direct)
  const directMatch = url.pathname.match(/^\/(\d+)/)
  if (directMatch?.[1]) return { provider: 'vimeo', id: directMatch[1] }

  return null
}

/**
 * Parse Spotify URLs
 * Pattern: open.spotify.com/track/{id} only (reject playlist/album)
 */
const parseSpotify = (url: URL): ParsedUrl | null => {
  const host = url.hostname.replace(/^www\./, '')

  if (host !== 'open.spotify.com') return null

  // Only track URLs - reject playlist, album, artist, etc.
  const match = url.pathname.match(/^\/track\/([a-zA-Z0-9]+)/)
  if (match?.[1]) return { provider: 'spotify', id: match[1] }

  return null
}

/**
 * Parse Discogs URLs
 * Patterns: discogs.com/release/{id}, discogs.com/master/{id}
 * With or without slug/locale prefix
 */
const parseDiscogs = (url: URL): ParsedUrl | null => {
  const host = url.hostname.replace(/^www\./, '')

  if (host !== 'discogs.com') return null

  // Patterns: /release/{id}, /master/{id}
  // Or with locale: /{locale}/release/{id}, /{locale}/master/{id}
  // ID may be followed by slug: /release/12345-Artist-Album
  const match = url.pathname.match(/(?:^|\/)(release|master)\/(\d+)/)
  if (match?.[2]) return { provider: 'discogs', id: match[2] }

  return null
}
