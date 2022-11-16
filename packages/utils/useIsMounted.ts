import { useRef } from 'react'
import { useIsoMorphicEffect } from './useIsoMorphicEffect'

export function useIsMounted() {
   let mounted = useRef(false)

   useIsoMorphicEffect(() => {
      mounted.current = true

      return () => {
         mounted.current = false
      }
   }, [])

   return mounted
}
