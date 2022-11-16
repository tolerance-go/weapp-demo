import { useEffect } from 'react'

export const useMountedAndUnMounted = (fn: Function) => {
   useEffect(() => {
      return fn()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])
}
