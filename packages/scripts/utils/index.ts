import omit from 'lodash.omit'
import { pathToRegexp } from 'path-to-regexp'
import { MenuData } from '../typings'

export const genMenuMaps = <T extends MenuData = MenuData>(
   data: T[],
): Record<string, T> => {
   return data.reduce((acc, next) => {
      return {
         ...acc,
         [next.url]: omit(next, 'children'),
         ...genMenuMaps(next.children),
      }
   }, {})
}

export const findMenuDataByRoute = <T extends MenuData = MenuData>(
   route: string,
   menuMaps?: Record<string, T>,
) => {
   if (!menuMaps) return null

   const key = Object.keys(menuMaps).find((key) => {
      const regexp = pathToRegexp(convertNextPathToRegexpPath(key))
      return regexp.exec(removeUrlPathQueryPart(route))
   })
   if (key) {
      return menuMaps[key]
   }
   return null
}

export const convertNextPathToRegexpPath = (pathname: string) => {
   return pathname.replace(/\[(.*?)\]/g, ':$1')
}

export const convertApiPathToFnOrReturn = (pathname: string) => {
   const items = pathname.match(/\[(.*?)\]/gi)
   if (items?.length) {
      return `(${pathname
         .match(/\[.*?\]/gi)
         ?.map(
            (item) => `${item.replace(/\[(.*?)\]/gi, '$1')}: string | number`,
         )
         .join(', ')}) => ${pathname.replace(/\[(.*?)\]/gi, '${$1}')}`
   }
   return pathname
}

export const convertApiPathToCallOrReturn = (pathname: string) => {
   // 注意这里多了一个 /，匹配 '/[id]' 而不是 '[id]'
   const items = pathname.match(/\/\[(.*?)\]/gi)
   if (items?.length) {
      return `${pathname}(${pathname
         .match(/\/\[.*?\]/gi)
         ?.map((item) => `params.${item.replace(/\/\[(.*?)\]/gi, '$1')}`)
         .join(', ')})`
   }
   return pathname
}

export const convertApiPathToObjectType = (pathname: string) => {
   const items = pathname.match(/\/\[(.*?)\]/gi)
   if (items?.length) {
      return `{${pathname
         .match(/\/\[.*?\]/gi)
         ?.map(
            (item) => `${item.replace(/\/\[(.*?)\]/gi, '$1')}: string | number`,
         )
         .join('; ')}}`
   }
   return '{}'
}

/**
 * 移除 url path 上的 query
 */
export const removeUrlPathQueryPart = (urlPath: string) => {
   return urlPath.split('?')[0]
}
