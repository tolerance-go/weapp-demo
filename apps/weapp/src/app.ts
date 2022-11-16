import { apiData } from '@yorkbar/admin/gen/apiData'
import { User } from '@yorkbar/admin/typings/user'
import Taro, { useLaunch } from '@tarojs/taro'
import { PropsWithChildren } from 'react'
import './app.scss'
import { TOKEN_FIELD } from './constants/storage'
import { UserStore } from './stores/user'
import { joinDomain } from './utils/joinDomain'
import { useRequest } from './utils/useRequest'

const App = (props: PropsWithChildren) => {
   const { request } = useRequest()

   const loginWithToken = async () => {
      try {
         // 本地存在 token，使用 token 登录
         // 后台会刷新 token 过期时间
         if (Taro.getStorageSync(TOKEN_FIELD)) {
            const rsp = await request<User>({
               url: joinDomain(
                  apiData['/api/user/login-miniprogram-with-token'],
               ),
               method: 'POST',
            })

            UserStore.login({
               username: rsp.data.username,
               avatarUrl: rsp.data.authorUrl ?? '',
            })

            if (rsp.cookies?.[0]) {
               Taro.setStorageSync(TOKEN_FIELD, rsp.cookies[0])
            }
         }
      } catch {
         Taro.removeStorageSync(TOKEN_FIELD)
         UserStore.logout()
      }
   }

   useLaunch(() => {
      console.log('useLaunch')
      loginWithToken()
   })

   return props.children
}

export default App
