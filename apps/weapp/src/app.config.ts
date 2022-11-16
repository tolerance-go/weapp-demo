import { tabBarList } from './constants/tabBarList'

export default defineAppConfig({
   appId: 'wxbd10576f991057f9',
   pages: ['pages/index/index', 'pages/my/index'],
   entryPagePath: 'pages/my/index',
   window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
   },
   tabBar: {
      custom: true,
      color: '#fff',
      selectedColor: '#fff',
      backgroundColor: '#fff',
      list: tabBarList,
   },
})
