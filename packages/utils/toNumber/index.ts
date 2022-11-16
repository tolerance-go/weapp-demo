import { isNullOrUndefined } from '../isNullOrUndefined'

export const toNumber = <T extends any>(n: T) => {
   if (isNullOrUndefined(n)) {
      return n
   }
   return Number(n)
}
