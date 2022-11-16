import { describe, expect, test } from '@jest/globals'
import { convertApiPathToObjectType } from '../utils'

describe('convertApiPathToObjectType', () => {
   test('basic', () => {
      expect(
         convertApiPathToObjectType("apiUrls['/api/project/show/[id]']"),
      ).toEqual('{id: string | number}')

      expect(
         convertApiPathToObjectType("apiUrls['/api/project/show/[id]/[sid]']"),
      ).toEqual('{id: string | number; sid: string | number}')

      expect(
         convertApiPathToObjectType("apiUrls['/api/project/show']"),
      ).toEqual('{}')
   })
})
