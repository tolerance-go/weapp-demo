import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Override } from './Override'

const getError = (msg: string, code?: number) => {
   const err = new Error(msg)

   err.cause = code
   return err
}

export type ErrorBody = {
   message: string
}

export async function request2<ReqParamsData, ReqData, ResData>(
   configs: Override<
      AxiosRequestConfig<ReqData>,
      {
         params: ReqParamsData
      }
   >,
): Promise<AxiosResponse<ResData, ReqData>>
export async function request2<ResData>(
   configs: AxiosRequestConfig,
): Promise<AxiosResponse<ResData>>
export async function request2<ReqData, ResData>(
   configs: AxiosRequestConfig<ReqData>,
): Promise<AxiosResponse<ResData, ReqData>>
export async function request2(
   configs: AxiosRequestConfig,
): Promise<AxiosResponse> {
   return axios
      .request({ withCredentials: true, ...configs })
      .catch((error) => {
         if (error.response) {
            // 约定优先使用 message 字段
            throw getError(
               error.response.data?.message ?? error.message,
               error.response.status,
            )
         } else if (error.request) {
            throw getError('请求已经成功发起，但没有收到响应')
         } else {
            throw getError('发送请求时出了点问题')
         }
      })
}

export type { AxiosRequestConfig }
