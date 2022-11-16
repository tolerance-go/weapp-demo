import { describe, expect, test } from '@jest/globals'
import { removeUrlPathQueryPart } from '../utils'

describe('removeUrlPathQueryPart', () => {
   test('basic', () => {
      expect(removeUrlPathQueryPart('/other?id=1')).toEqual('/other')
      expect(removeUrlPathQueryPart('/other')).toEqual('/other')
   })
})
