import { apiData } from '@yorkbar/admin/gen/apiData'
import { User } from '@yorkbar/admin/typings/user'
import themes from '@yorkbar/ui/components/themes/presets/default'
import { css, cx } from '@linaria/core'
import { Button, Image, Text, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { memo, PropsWithChildren, useMemo } from 'react'
import { useToast } from 'taro-hooks'
import { useSnapshot } from 'valtio'
import { UserStore } from '../../stores/user'
import { useRequest } from '../../utils/useRequest'
// import { useCallback } from 'react'
import { TOKEN_FIELD } from '../../constants/storage'
import CustomTabBar from '../../custom-tab-bar'
import { joinDomain } from '../../utils/joinDomain'

const MenuItem = memo(
   (
      props: PropsWithChildren<{
         disabled?: boolean
      }>,
   ) => {
      return (
         <Text
            className={cx(
               'menu-item',
               props.disabled && 'disabled',
               css`
                  font-size: 32px;
                  padding: 40px 80px;
                  margin-top: 55px;

                  &.disabled {
                     text-decoration: line-through;
                     color: ${themes.palette.accents_4};
                     font-style: italic;
                  }
               `,
            )}
         >
            {props.children}
         </Text>
      )
   },
)

const UserAuthor = memo(() => {
   const userStore = useSnapshot(UserStore)
   const { request } = useRequest()

   const syncAvatar = async (authorUrl: string) => {
      await request<Partial<User>, User>({
         url: joinDomain(apiData['/api/user/update']),
         method: 'POST',
         data: {
            authorUrl,
         },
      })
   }

   return (
      <>
         {userStore.userInfo?.avatarUrl ? (
            <Image
               src={userStore.userInfo?.avatarUrl}
               mode='aspectFit'
               className={cx(
                  'authorImg',
                  css`
                     height: 200px;
                     width: 200px;
                     border-radius: 100px;
                     background-color: ${themes.palette.accents_2};
                  `,
               )}
            ></Image>
         ) : (
            <Button
               openType='chooseAvatar'
               className={cx(
                  'authorBtn',
                  css`
                     height: 200px;
                     width: 200px;
                     border-radius: 100px;
                     background-color: ${themes.palette.accents_2};
                     border: none;
                  `,
               )}
               onChooseAvatar={(event) => {
                  UserStore.chooseAvatar(event.detail.avatarUrl)
                  syncAvatar(event.detail.avatarUrl)
               }}
            ></Button>
         )}

         <Text
            className={cx(
               'username',
               css`
                  margin-top: 50px;
                  font-size: 32px;
               `,
            )}
         >
            {userStore.userInfo?.username ?? '--'}
         </Text>
      </>
   )
})

const LoginButton = memo(() => {
   const { request } = useRequest()
   const [showToast] = useToast()
   return (
      <Button
         // openType='getUserInfo'
         // onGetUserInfo={(userInfo) => {
         //     UserStore.login({
         //         username: userInfo.detail.userInfo.nickName,
         //         avatarUrl: userInfo.detail.userInfo.avatarUrl,
         //     })
         // }}
         className={cx(
            'username',
            css`
               font-size: 32px;

               position: relative;
               border-radius: 12px;
               background-color: #000;
               border: 1px solid #000;
               color: #fff;
               padding: 0 32px;
            `,
         )}
         onClick={async () => {
            try {
               const info = await Taro.login()
               //发起网络请求
               try {
                  const rsp = await request<{ code: string }, User>({
                     url: joinDomain(
                        apiData[
                           '/api/user/login-miniprogram-or-create-with-code'
                        ],
                     ),
                     data: {
                        code: info.code,
                     },
                     method: 'POST',
                  })

                  UserStore.login({
                     username: rsp.data.username,
                     avatarUrl: rsp.data.authorUrl ?? '',
                  })

                  if (rsp.cookies?.[0]) {
                     Taro.setStorageSync(TOKEN_FIELD, rsp.cookies[0])
                  }
               } catch {}
            } catch {
               showToast({
                  title: '登录调用失败，请重试',
                  icon: 'error',
               })
            }
         }}
      >
         登录
      </Button>
   )
})

const Header = memo(() => {
   const userStore = useSnapshot(UserStore)
   return (
      <View
         className={cx(
            'header',
            css`
               height: 425px;
               width: 100%;
               display: flex;
               justify-content: center;
               align-items: center;
               background-color: ${themes.palette.accents_1};
               flex-direction: column;
            `,
         )}
      >
         {userStore.userInfo ? <UserAuthor /> : <LoginButton />}
      </View>
   )
})

const Menu = memo(() => {
   const userStore = useSnapshot(UserStore)

   return (
      <View
         className={cx(
            'menu',
            css`
               display: flex;
               justify-content: center;
               align-items: center;
               flex-direction: column;
               padding-top: 30px;
            `,
         )}
      >
         <MenuItem disabled={!userStore.userInfo}>我的足迹</MenuItem>
         <MenuItem disabled={!userStore.userInfo}>我的收藏</MenuItem>
         <MenuItem disabled={!userStore.userInfo}>我的作品</MenuItem>
      </View>
   )
})

const My = memo(() => {
   // const env = useEnv()
   // const [, { setTitle }] = useNavigationBar()

   // const [show] = useModal({
   //     title: 'Taro Hooks!',
   //     showCancel: false,
   //     confirmColor: '#8c2de9',
   //     confirmText: '支持一下',
   //     mask: true,
   // })
   // const [showToast] = useToast({ mask: true })

   // const handleModal = useCallback(() => {
   //     show({ content: '不如给一个star⭐️!' }).then(() => {
   //         showToast({ title: '点击了支持!' })
   //     })
   // }, [show, showToast])

   const page = useMemo(() => Taro.getCurrentInstance().page, [])

   useDidShow(() => {
      const tabBar = Taro.getTabBar<CustomTabBar>(page)
      tabBar?.setSelected(1)
   })

   return (
      <View
         className={cx(
            'page',
            css`
               position: relative;
            `,
         )}
      >
         <Header />
         <Menu />
      </View>
   )
})

export default My
