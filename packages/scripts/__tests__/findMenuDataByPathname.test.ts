import { describe, expect, test } from '@jest/globals'
import { findMenuDataByRoute } from '../utils'

describe('findMenuDataByPathname', () => {
   test('basic', () => {
      expect(
         findMenuDataByRoute('/project/1', {
            '/project/[id]': {
               key: '/project/[id]',
               name: 'xxxx',
               url: '/project/[id]',
               order: 0,
               meta: {
                  isNav: true,
                  isGroup: false,
                  isIndex: false,
               },
               children: [],
            },
         }),
      ).toEqual({
         key: '/project/[id]',
         name: 'xxxx',
         url: '/project/[id]',
         order: 0,
         meta: {
            isNav: true,
            isGroup: false,
            isIndex: false,
         },
         children: [],
      })
   })

   test('query', () => {
      expect(
         findMenuDataByRoute('/project/1?id=1', {
            '/project/[id]': {
               key: '/project/[id]',
               name: 'xxxx',
               url: '/project/[id]',
               order: 0,
               meta: {
                  isNav: true,
                  isGroup: false,
                  isIndex: false,
               },
               children: [],
            },
         }),
      ).toEqual({
         key: '/project/[id]',
         name: 'xxxx',
         url: '/project/[id]',
         order: 0,
         meta: {
            isNav: true,
            isGroup: false,
            isIndex: false,
         },
         children: [],
      })
   })
})
