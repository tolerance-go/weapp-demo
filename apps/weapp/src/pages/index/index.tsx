import themes from '@yorkbar/ui/components/themes/presets/default'
import { css, cx } from '@linaria/core'
import { Image, Text, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { memo, useMemo } from 'react'
import { useSnapshot } from 'valtio'
import type CustomTabBar from '../../custom-tab-bar'
import { StoriesStore } from '../../stores/stories'

import './index.scss'

const NavItem = memo(
   (props: {
      title: string
      itemKey: string
      activeKey?: string
      onClick: (key: string) => void
   }) => {
      const isActive = props.activeKey === props.itemKey
      return (
         <View
            onClick={() => props.onClick(props.itemKey)}
            className={cx(
               'navBar-item',
               css`
                  display: flex;
                  justify-content: flex-end;
                  align-items: center;
                  height: 100%;
                  position: relative;
                  flex-direction: column;
               `,
            )}
         >
            <Text
               className={cx(
                  'navBar-item-text',
                  isActive && 'isActive',
                  css`
                     color: ${themes.palette.accents_4};
                     font-size: 28px;
                     font-weight: bold;
                     padding: 0 100px;
                     margin-bottom: 6px;
                     &.isActive {
                        color: ${themes.palette.accents_8};
                     }
                  `,
               )}
            >
               {props.title}
            </Text>
            <View
               className={cx(
                  'navBar-item-focuser',
                  isActive && 'isActive',
                  css`
                     margin-bottom: 16px;
                     width: 20px;
                     height: 6px;
                     background-color: ${themes.palette.accents_4};
                     &.isActive {
                        background-color: ${themes.palette.accents_8};
                     }
                  `,
               )}
            ></View>
         </View>
      )
   },
)

const NavBar = memo(() => {
   const storiesStore = useSnapshot(StoriesStore)
   return (
      <View
         className={cx(
            'navBar',
            css`
               display: flex;
               justify-content: center;
               align-items: center;
               height: 100%;
               position: relative;
            `,
         )}
      >
         <NavItem
            activeKey={storiesStore.activeKey}
            title='热门'
            itemKey={'hot'}
            onClick={(key) => {
               StoriesStore.setActiveKey(key)
            }}
         />
         <NavItem
            activeKey={storiesStore.activeKey}
            title='最新'
            itemKey={'new'}
            onClick={(key) => {
               StoriesStore.setActiveKey(key)
            }}
         />
      </View>
   )
})

const AppItem = memo(() => {
   return (
      <View
         className={cx(
            'appPreview',
            css`
               border-bottom: 1px solid ${themes.palette.accents_2};
               padding: 20px;
            `,
         )}
      >
         <Image
            lazyLoad
            src=''
            mode='aspectFit'
            className={cx(
               'appPreview-image',
               css`
                  width: 100%;
                  background-color: ${themes.palette.accents_1};
               `,
            )}
         ></Image>
         <View
            className={cx(
               'appPreview-descBar',
               css`
                  margin-top: 10px;
               `,
            )}
         >
            <Text
               className={cx(
                  'appPreview-descBar-text',
                  css`
                     font-size: 28px;
                     font-weight: 600;
                     font-style: italic;
                  `,
               )}
            >
               标题的信息
            </Text>
         </View>
      </View>
   )
})

const Index = memo(() => {
   const page = useMemo(() => Taro.getCurrentInstance().page, [])

   useDidShow(() => {
      const tabbar = Taro.getTabBar<CustomTabBar>(page)
      tabbar?.setSelected(0)
   })

   return (
      <View
         className={cx(
            'page',
            css`
               & .appPreview {
                  &:last-child {
                     border-bottom: none;
                  }
               }
            `,
         )}
      >
         <View
            className={cx(
               'header',
               css`
                  height: 75px;
                  border-bottom: 1px solid ${themes.palette.accents_2};
                  color: red;
               `,
            )}
         >
            <NavBar />
         </View>
         <AppItem />
         <AppItem />
         <AppItem />
         <AppItem />
      </View>
   )
})

export default Index
