import { useEffect } from 'react'

export const useMounted = (fn: Function) => {
   useEffect(() => {
      fn()
   }, [])
}
