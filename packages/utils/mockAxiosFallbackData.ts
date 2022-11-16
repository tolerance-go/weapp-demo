export const mockAxiosFallbackData = <D extends any>(initialData: D) => {
   return (
      initialData && {
         status: 200,
         statusText: 'InitialData',
         config: {},
         headers: {},
         data: initialData,
      }
   )
}
