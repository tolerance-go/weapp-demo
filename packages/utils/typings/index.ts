export type WithRes<T> = WithSuccessRes<T> | (ErrorRes & { data?: T }) // 方便对于 WithRes<T> 类型的数据直接进行 data 取值 ?.data

export type ErrorRes = {
   error: true
   code: string
   message: string
}

export type WithSuccessRes<T> = {
   data: T
   error: false
}
