import { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react'

export type ForwardRefFC<T, P> = ForwardRefExoticComponent<
  PropsWithoutRef<P> & RefAttributes<T>
>
