import {
   ForwardRefExoticComponent,
   PropsWithoutRef,
   RefAttributes,
} from 'react'

export type FFC<T, P = {}> = ForwardRefExoticComponent<
   PropsWithoutRef<P> & RefAttributes<T>
>
