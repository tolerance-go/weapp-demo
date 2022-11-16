import { isError, useLatest } from '@yorkbar/utils'
import Taro from '@tarojs/taro'
import debounce from 'lodash-es/debounce'
import { useMemo, useState } from 'react'
import { useToast } from 'taro-hooks'
import { TOKEN_FIELD } from '../constants/storage'

const isWxAPIError = (error: unknown): error is TaroGeneral.CallbackResult => {
   return typeof error === 'object' && error !== null && 'errMsg' in error
}

type TaroRequestData = string | TaroGeneral.IAnyObject | ArrayBuffer

export const useRequest = (options?: {
   debounce?: number
   enableLoading?: boolean
}) => {
   const [loading, setLoading] = useState(false)
   const enableLoadingRef = useLatest(options?.enableLoading)
   const [showToast] = useToast()

   const handler = useMemo(
      () => {
         // 一个泛型参数为返回值
         async function fn<ResData extends TaroRequestData>(
            configs: Taro.request.Option<ResData, any>,
         ): Promise<Taro.request.SuccessCallbackResult<ResData>>
         async function fn<
            ReqData extends TaroRequestData,
            ResData extends TaroRequestData,
         >(
            configs: Taro.request.Option<ResData, ReqData>,
         ): Promise<Taro.request.SuccessCallbackResult<ResData>>
         async function fn<
            ReqData extends TaroRequestData,
            ResData extends TaroRequestData,
         >(configs: Taro.request.Option<ResData, ReqData>) {
            try {
               enableLoadingRef.current && setLoading(true)
               return await request<ReqData, ResData>({
                  ...configs,
                  header: {
                     cookie: Taro.getStorageSync(TOKEN_FIELD),
                     ...configs.header,
                  },
               })
            } catch (error: unknown) {
               console.log(error)
               if (isWxAPIError(error)) {
                  // wx 自己的 api 返回的错误
                  // 这个结论不一定正确，目前只测试了非合法请求域名的情况，
                  // 并且不知道是不是 taro 封装的结构
                  showToast({
                     title: '系统异常',
                     icon: 'error',
                  })
                  console.log(error.errMsg)
               } else if (isError(error)) {
                  showToast({
                     title: error.message,
                     icon: 'error',
                  })
               }
               // 继续抛出去
               throw error
            } finally {
               enableLoadingRef.current && setLoading(false)
            }
         }

         return fn
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
   )

   const req = useMemo(
      () =>
         (options?.debounce
            ? debounce(handler, options?.debounce)
            : handler) as typeof handler,
      [options?.debounce, handler],
   )

   return {
      request: req,
      loading,
   }
}

const getErrorMessageByCode = (code: number) => {
   switch (code) {
      case 401:
         return '认证失败'
      default:
         return '服务异常'
   }
}

// 注意 taro 和 axios 的实现结果不一致
// taro 不管状态码是不是 非 200，都 resolve 返回结构
export const request = async <
   ReqData extends TaroRequestData,
   ResData extends TaroRequestData,
>(
   configs: Taro.request.Option<ResData, ReqData>,
): Promise<Taro.request.SuccessCallbackResult<ResData>> => {
   return Taro.request<ResData, ReqData>(configs).then((data) => {
      if (data.statusCode !== 200) {
         console.log('服务异常', data)
         throw new Error(getErrorMessageByCode(data.statusCode))
      }
      return data
   })
}
