import { describe, expect, it } from 'vitest'
import { detectLocale } from './locale'

describe('detectLocale', () => {
  it('prefers a stored locale', () => {
    expect(detectLocale('en', 'zh-CN')).toBe('en')
    expect(detectLocale('zh', 'en-US')).toBe('zh')
  })

  it('detects Chinese browser locales', () => {
    expect(detectLocale(null, 'zh-CN')).toBe('zh')
    expect(detectLocale(null, 'zh-TW')).toBe('zh')
  })

  it('defaults non-Chinese locales to English', () => {
    expect(detectLocale(null, 'fr-FR')).toBe('en')
  })
})
