export const menuData = [
   {
      key: '/Stage',
      name: 'Stage',
      url: '/Stage',
      order: 0,
      meta: { isGroup: true, isNav: true, isIndex: false },
      children: [
         {
            key: '/Stage/motion-path-point.stories',
            name: '节点间 path 可以增加锚点和修改曲率',
            url: '/Stage/motion-path-point.stories',
            order: 0,
            meta: {
               title: '节点间 path 可以增加锚点和修改曲率',
               isGroup: false,
               isNav: false,
               isIndex: false,
            },
            children: [],
         },
      ],
   },
   {
      key: '/TweenLine',
      name: 'TweenLine',
      url: '/TweenLine',
      order: 0,
      meta: { isGroup: true, isNav: true, isIndex: false },
      children: [
         {
            key: '/TweenLine/fixed-scroller',
            name: '跟随滚动区域',
            url: '/TweenLine/fixed-scroller',
            order: 0,
            meta: {
               title: '跟随滚动区域',
               isGroup: false,
               isNav: false,
               isIndex: false,
            },
            children: [],
         },
      ],
   },
   {
      key: '/',
      name: 'index',
      url: '/',
      order: 0,
      meta: { isGroup: false, isNav: true, isIndex: true },
      children: [],
   },
]
export const menuMaps = {
   '/Stage': {
      key: '/Stage',
      name: 'Stage',
      url: '/Stage',
      order: 0,
      meta: { isGroup: true, isNav: true, isIndex: false },
   },
   '/Stage/motion-path-point.stories': {
      key: '/Stage/motion-path-point.stories',
      name: '节点间 path 可以增加锚点和修改曲率',
      url: '/Stage/motion-path-point.stories',
      order: 0,
      meta: {
         title: '节点间 path 可以增加锚点和修改曲率',
         isGroup: false,
         isNav: false,
         isIndex: false,
      },
   },
   '/TweenLine': {
      key: '/TweenLine',
      name: 'TweenLine',
      url: '/TweenLine',
      order: 0,
      meta: { isGroup: true, isNav: true, isIndex: false },
   },
   '/TweenLine/fixed-scroller': {
      key: '/TweenLine/fixed-scroller',
      name: '跟随滚动区域',
      url: '/TweenLine/fixed-scroller',
      order: 0,
      meta: {
         title: '跟随滚动区域',
         isGroup: false,
         isNav: false,
         isIndex: false,
      },
   },
   '/': {
      key: '/',
      name: 'index',
      url: '/',
      order: 0,
      meta: { isGroup: false, isNav: true, isIndex: true },
   },
}
