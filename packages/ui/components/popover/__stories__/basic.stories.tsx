import { css, cx } from '@emotion/css'
import { LogOut } from '@geist-ui/icons'
import MoonIcon from '@geist-ui/icons/moon'
import { Meta, Story } from '@storybook/react/types-6-0'
import Avatar from '../../avatar'
import Spacer from '../../spacer'
import Popover, { PopoverProps } from '../index'

export default {
  title: 'components/Popover',
  component: Popover,
  argTypes: {},
} as Meta

const sidebarWidth = '200px'

export const Container: Story<PopoverProps> = () => {
  return (
    <div
      className={cx(
        'layout',
        css`
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
        `,
      )}
    >
      <div
        className={cx(
          'sideBar',
          css`
            width: ${sidebarWidth};
            position: absolute;
            right: 0;
            top: 0;
            height: 100vh;
            border-left: 1px solid #000;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
          `,
        )}
      >
        <div
          className={css`
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
          `}
        >
          <Popover
            placement="left"
            content={
              <div>
                <Popover.Item>
                  <LogOut size={14}></LogOut>
                  <Spacer inline w={0.5}></Spacer>
                  <span>退出</span>
                </Popover.Item>
                <Popover.Item>
                  <MoonIcon size={14} />
                  <Spacer inline w={0.5}></Spacer>
                  <span>切换主题</span>
                </Popover.Item>
              </div>
            }
          >
            <Avatar />
          </Popover>
        </div>
      </div>
      <div
        className={cx(
          'content',
          css`
            position: absolute;
            top: 0;
            left: 0;
            right: ${sidebarWidth};
            bottom: 0;
            height: 100vh;
            &::-webkit-scrollbar {
              width: 7px;
              background-color: transparent;
            }
          `,
        )}
      ></div>
    </div>
  )
}
Container.storyName = '定制容器'
