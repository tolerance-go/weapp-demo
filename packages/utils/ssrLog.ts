export const ssrLog = (...args: any[]) => {
   process.env.NODE_ENV === 'development' &&
      typeof window === 'undefined' &&
      console.log(...args)
}
