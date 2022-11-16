import { describe, expect, test } from '@jest/globals'
import { convertApiPathToFnOrReturn } from '../utils'

describe('convertApiPathToFnOrReturn', () => {
   test('basic', () => {
      expect(
         convertApiPathToFnOrReturn('`${API_PREFIX}/api/project/show/[id]`'),
      ).toEqual(
         '(id: string | number) => `${API_PREFIX}/api/project/show/${id}`',
      )

      expect(
         convertApiPathToFnOrReturn(
            '`${API_PREFIX}/api/project/show/[id]/[sid]`',
         ),
      ).toEqual(
         '(id: string | number, sid: string | number) => `${API_PREFIX}/api/project/show/${id}/${sid}`',
      )

      expect(
         convertApiPathToFnOrReturn('`${API_PREFIX}/api/project/show`'),
      ).toEqual('`${API_PREFIX}/api/project/show`')
   })
})
