import { proxy } from 'valtio'

export const StoriesStore = proxy({
   activeKey: 'hot' as 'hot' | 'new',

   setActiveKey(key: string) {
      this.activeKey = key
   },
})
