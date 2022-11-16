import { View } from '@tarojs/components'
import { memo } from 'react'
import './index.scss'

export const Loading = memo(() => {
   return (
      <View className='loading-container'>
         <View className='loading'>
            <i />
            <i />
            <i />
         </View>
      </View>
   )
})
