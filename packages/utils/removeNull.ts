export type RecursivelyRemoveNulls<T> = T extends null
   ? undefined
   : {
        [K in keyof T]: T[K] extends (infer U)[]
           ? RecursivelyRemoveNulls<U>[]
           : RecursivelyRemoveNulls<T[K]>
     }

export function recursivelyRemoveNulls<T>(obj: T): RecursivelyRemoveNulls<T> {
   if (obj === null) {
      return undefined as any
   }
   if (typeof obj === 'object') {
      for (let key in obj) {
         obj[key] = recursivelyRemoveNulls(obj[key]) as any
      }
   }
   return obj as any
}
