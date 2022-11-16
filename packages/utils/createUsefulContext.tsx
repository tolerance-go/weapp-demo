import {
   createContext,
   memo,
   PropsWithChildren,
   useContext,
   useMemo,
   useRef,
} from 'react'

export const createUsefulContext = <P, C, I>(
   initial: I,
   getContext: (props: P) => C,
   opts?: {
      required?: boolean
   },
) => {
   const Context = createContext<C | I>(initial)

   const useContext2 = () => {
      const context = useContext(Context)
      if (opts?.required && !context) {
         throw new Error('context must be exist')
      }
      return context
   }

   const Provider = memo(({ children, ...rest }: PropsWithChildren<P>) => {
      const rendered = useRef(false)

      const meta = useMemo(() => {
         if (rendered.current) {
            console.log(
               'createUsefulContext: context 重新生成了，除了 children 以外的 props 发生了改变',
               rest,
            )
         }

         rendered.current = true

         return getContext(rest as P)

         // 确保当组件 props 的 key 为空的时候，也传递了 key 为 undefined 或者 null，
         // 否则 Object.keys 的返回元素顺序就打乱了
         // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [...Object.keys(rest).map((key) => rest[key as keyof typeof rest])])

      return <Context.Provider value={meta}>{children}</Context.Provider>
   })

   return {
      Provider,
      use: useContext2,
   }
}
