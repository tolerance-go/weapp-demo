import { describe, expect, test } from '@jest/globals'
import { toNumber } from '../index'

describe('toNumber', () => {
   test('basic', () => {
      expect(toNumber('2')).toEqual(2)
      expect(toNumber(2)).toEqual(2)
      expect(toNumber(undefined)).toEqual(undefined)
      expect(toNumber(null)).toEqual(undefined)
      expect(toNumber(['2'])).toEqual(2)
      expect(toNumber(['2', '3'])).toEqual(NaN)
   })
})
