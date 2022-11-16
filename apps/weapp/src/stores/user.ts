import { WithUndefined } from '@yorkbar/utils/src/withNull'
import { proxy } from 'valtio'

export const UserStore = proxy({
   userInfo: undefined as WithUndefined<{
      username: string
      avatarUrl: string
   }>,

   fetching() {
      this.fetchUserInfoLoading = true
   },

   fetched() {
      this.fetchUserInfoLoading = false
   },

   login(info: { username: string; avatarUrl: string }) {
      this.userInfo = {
         username: info.username,
         avatarUrl: info.avatarUrl,
      }
   },

   logout() {
      this.userInfo = undefined
   },

   chooseAvatar(avatarUrl: string) {
      this.userInfo.avatarUrl = avatarUrl
   },
})
