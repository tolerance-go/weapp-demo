import { describe, expect, test } from '@jest/globals'
import { convertApiPathToCallOrReturn } from '../utils'

describe('convertApiPathToCallOrReturn', () => {
   test('basic', () => {
      expect(
         convertApiPathToCallOrReturn("apiUrls['/api/project/show/[id]']"),
      ).toEqual("apiUrls['/api/project/show/[id]'](params.id)")

      expect(
         convertApiPathToCallOrReturn(
            "apiUrls['/api/project/show/[id]/[sid]']",
         ),
      ).toEqual(
         "apiUrls['/api/project/show/[id]/[sid]'](params.id, params.sid)",
      )

      expect(
         convertApiPathToCallOrReturn("apiUrls['/api/project/show']"),
      ).toEqual("apiUrls['/api/project/show']")
   })
})
