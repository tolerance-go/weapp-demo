import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { WithRes } from './typings'

export const request = async <ReqData, ResData extends WithRes<unknown>>(
   configs: AxiosRequestConfig<ReqData>,
): Promise<ResData> => {
   return axios
      .request<ResData>(configs)
      .then((data) => {
         return data.data
      })
      .catch((error: AxiosError<undefined, ReqData>) => {
         return {
            error: true,
            code: error.code ?? '',
            message: '网络异常',
         } as ResData
      })
}
