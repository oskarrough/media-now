import { describe, it, expect } from 'vitest'
import { parseTitle, cleanTitle } from './parse-title'

describe('parseTitle', () => {
  it('splits on hyphen with spaces', () => {
    const result = parseTitle('Daft Punk - Get Lucky')
    expect(result.artist).toBe('Daft Punk')
    expect(result.title).toBe('Get Lucky')
    expect(result.original).toBe('Daft Punk - Get Lucky')
  })

  it('splits on en-dash with spaces', () => {
    const result = parseTitle('Daft Punk – Get Lucky')
    expect(result.artist).toBe('Daft Punk')
    expect(result.title).toBe('Get Lucky')
  })

  it('splits on colon with space', () => {
    const result = parseTitle('Daft Punk: Get Lucky')
    expect(result.artist).toBe('Daft Punk')
    expect(result.title).toBe('Get Lucky')
  })

  it('splits on pipe with spaces', () => {
    const result = parseTitle('Daft Punk | Get Lucky')
    expect(result.artist).toBe('Daft Punk')
    expect(result.title).toBe('Get Lucky')
  })

  it('splits on " by " (case insensitive) - artist after', () => {
    const result = parseTitle('Get Lucky by Daft Punk')
    expect(result.artist).toBe('Daft Punk')
    expect(result.title).toBe('Get Lucky')
  })

  it('splits on " BY " (uppercase)', () => {
    const result = parseTitle('Get Lucky BY Daft Punk')
    expect(result.artist).toBe('Daft Punk')
    expect(result.title).toBe('Get Lucky')
  })

  it('returns null artist when no separator found', () => {
    const result = parseTitle('Get Lucky')
    expect(result.artist).toBe(null)
    expect(result.title).toBe('Get Lucky')
  })

  it('hyphen takes precedence over by', () => {
    const result = parseTitle('Daft Punk - Stand by Me')
    expect(result.artist).toBe('Daft Punk')
    expect(result.title).toBe('Stand by Me')
  })

  it('cleans title before parsing', () => {
    const result = parseTitle('Daft Punk - Get Lucky (feat. Pharrell)')
    expect(result.artist).toBe('Daft Punk')
    expect(result.title).toBe('Get Lucky')
  })

  it('preserves original in output', () => {
    const input = 'Daft Punk - Get Lucky (feat. Pharrell) [Official Video]'
    const result = parseTitle(input)
    expect(result.original).toBe(input)
  })
})

describe('cleanTitle', () => {
  it('removes content after //', () => {
    expect(cleanTitle('Artist - Title // Album Info')).toBe('Artist - Title')
  })

  it('removes content after \\\\', () => {
    expect(cleanTitle('Artist - Title \\\\ More Info')).toBe('Artist - Title')
  })

  it('removes content after ||', () => {
    expect(cleanTitle('Artist - Title || Extra')).toBe('Artist - Title')
  })

  it('removes content after --', () => {
    expect(cleanTitle('Artist - Title -- 2024')).toBe('Artist - Title')
  })

  it('removes trailing parentheticals', () => {
    expect(cleanTitle('Get Lucky (Official Video)')).toBe('Get Lucky')
  })

  it('removes multiple trailing parentheticals', () => {
    expect(cleanTitle('Get Lucky (feat. Pharrell) (Official)')).toBe('Get Lucky')
  })

  it('removes trailing brackets', () => {
    expect(cleanTitle('Get Lucky [HD]')).toBe('Get Lucky')
  })

  it('removes multiple trailing brackets', () => {
    expect(cleanTitle('Get Lucky [Remix] [HD]')).toBe('Get Lucky')
  })

  it('removes feat. info', () => {
    expect(cleanTitle('Get Lucky feat. Pharrell')).toBe('Get Lucky')
  })

  it('removes ft. info', () => {
    expect(cleanTitle('Get Lucky ft. Pharrell')).toBe('Get Lucky')
  })

  it('removes featuring info', () => {
    expect(cleanTitle('Get Lucky featuring Pharrell')).toBe('Get Lucky')
  })

  it('removes with info', () => {
    expect(cleanTitle('Get Lucky with Pharrell')).toBe('Get Lucky')
  })

  it('removes remix suffix', () => {
    expect(cleanTitle('Get Lucky Remix')).toBe('Get Lucky')
  })

  it('removes edit suffix', () => {
    expect(cleanTitle('Get Lucky Edit')).toBe('Get Lucky')
  })

  it('removes version suffix', () => {
    expect(cleanTitle('Get Lucky Version')).toBe('Get Lucky')
  })

  it('removes mix suffix', () => {
    expect(cleanTitle('Get Lucky Mix')).toBe('Get Lucky')
  })

  it('removes dub suffix', () => {
    expect(cleanTitle('Get Lucky Dub')).toBe('Get Lucky')
  })

  it('trims whitespace', () => {
    expect(cleanTitle('  Get Lucky  ')).toBe('Get Lucky')
  })

  it('collapses multiple spaces', () => {
    expect(cleanTitle('Get    Lucky')).toBe('Get Lucky')
  })

  it('handles complex example from spec', () => {
    expect(cleanTitle('Daft Punk - Get Lucky (feat. Pharrell) [Official Video]'))
      .toBe('Daft Punk - Get Lucky')
  })

  it('handles empty string', () => {
    expect(cleanTitle('')).toBe('')
  })
})
