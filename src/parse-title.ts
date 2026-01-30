/**
 * Pure functions to parse and clean track titles for search queries.
 */

import type { ParsedTitle } from './types'

/** Separators in order of precedence */
const SEPARATORS = [
  ' - ',    // hyphen with spaces
  ' – ',    // en-dash with spaces
  ': ',     // colon with space
  ' | ',    // pipe with spaces
]

/** Case-insensitive separator pattern for " by " */
const BY_SEPARATOR = / by /i

/**
 * Parse a title string into artist and title components.
 * Splits on separators in order of precedence.
 */
export const parseTitle = (input: string): ParsedTitle => {
  const original = input

  // Clean the input first
  const cleaned = cleanTitle(input)

  // Try each separator in order of precedence
  for (const sep of SEPARATORS) {
    const idx = cleaned.indexOf(sep)
    if (idx !== -1) {
      return {
        artist: cleaned.slice(0, idx).trim(),
        title: cleaned.slice(idx + sep.length).trim(),
        original,
      }
    }
  }

  // Try " by " (case insensitive)
  const byMatch = cleaned.match(BY_SEPARATOR)
  if (byMatch && byMatch.index !== undefined) {
    return {
      artist: cleaned.slice(byMatch.index + byMatch[0].length).trim(),
      title: cleaned.slice(0, byMatch.index).trim(),
      original,
    }
  }

  // No separator found
  return {
    artist: null,
    title: cleaned.trim(),
    original,
  }
}

/** Pattern to match content after //, \\, ||, -- (album info, etc.) */
const TRUNCATION_PATTERN = /\s*(?:\/\/|\\\\|\|\||--).*/

/** Pattern to match trailing parentheticals */
const PARENTHETICAL_PATTERN = /\s*\([^)]*\)\s*$/

/** Pattern to match trailing brackets */
const BRACKET_PATTERN = /\s*\[[^\]]*\]\s*$/

/** Pattern to match feat/featuring info - requires word boundary before keyword */
const FEATURING_PATTERN = /\s+(?:feat\.?|ft\.?|featuring|with)\s+.+$/gi

/** Pattern to match remix/edit suffixes at end (as standalone words) */
const REMIX_PATTERN = /\s+(?:remix|edit|version|mix|dub)\s*$/gi

/**
 * Clean a title for search purposes.
 * Aggressively removes noise like feat info, remix tags, etc.
 */
export const cleanTitle = (title: string): string => {
  let result = title

  // 1. Remove everything after //, \\, ||, --
  result = result.replace(TRUNCATION_PATTERN, '')

  // 2 & 3. Remove trailing parentheticals and brackets (repeat until none left)
  // Need to loop over both since they can be interleaved: "Title (foo) [bar]"
  let changed = true
  while (changed) {
    changed = false
    if (PARENTHETICAL_PATTERN.test(result)) {
      result = result.replace(PARENTHETICAL_PATTERN, '')
      changed = true
    }
    if (BRACKET_PATTERN.test(result)) {
      result = result.replace(BRACKET_PATTERN, '')
      changed = true
    }
  }

  // 4. Remove feat/featuring info
  result = result.replace(FEATURING_PATTERN, '')

  // 5. Remove remix/edit suffixes
  result = result.replace(REMIX_PATTERN, '')

  // 6. Trim whitespace and collapse multiple spaces
  result = result.trim().replace(/\s+/g, ' ')

  return result
}
