/**
 * Type definitions for media-now
 */

/** Supported media providers */
export type Provider = 'youtube' | 'vimeo' | 'spotify' | 'discogs' | 'musicbrainz'

/** Base interface for all media results */
export interface MediaResult {
  provider: Provider
  id: string
  url: string
  title: string
  /** Raw API response from provider */
  payload: unknown
}

/** YouTube media result */
export interface YouTubeResult extends MediaResult {
  provider: 'youtube'
  thumbnail: string
  author: string
  duration?: number
}

/** Vimeo media result */
export interface VimeoResult extends MediaResult {
  provider: 'vimeo'
  thumbnail: string
  author: string
  duration: number
}

/** Spotify media result */
export interface SpotifyResult extends MediaResult {
  provider: 'spotify'
  thumbnail: string
  artist: string
  duration: number
  album?: string
  isrc?: string
}

/** Discogs media result */
export interface DiscogsResult extends MediaResult {
  provider: 'discogs'
  year?: number
  genres: string[]
  styles: string[]
  artists: string[]
  labels: string[]
}

/** MusicBrainz media result */
export interface MusicBrainzResult extends MediaResult {
  provider: 'musicbrainz'
  artist: string
  releases: string[]
}

/** Search result from any provider */
export interface SearchResult {
  provider: Provider
  id: string
  title: string
  thumbnail?: string
  url: string
}

/** Result of parsing an "Artist - Title" string */
export interface ParsedTitle {
  artist: string | null
  title: string
  original: string
}
