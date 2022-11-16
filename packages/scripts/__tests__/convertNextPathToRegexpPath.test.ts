import { describe, expect, test } from '@jest/globals'
import { convertNextPathToRegexpPath } from '../utils'

describe('convertNextPathToRegexpPath', () => {
   test('basic', () => {
      expect(convertNextPathToRegexpPath('/project/[id]')).toBe('/project/:id')
   })

   test('long', () => {
      expect(convertNextPathToRegexpPath('/project/[name]/[id]')).toBe(
         '/project/:name/:id',
      )
   })
})
