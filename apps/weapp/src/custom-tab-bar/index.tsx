import { CoverView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Component } from 'react'

import { tabBarList } from '../constants/tabBarList'
import './index.scss'

export default class Index extends Component {
   state = {
      selected: 0,
      color: '#888',
      selectedColor: '#111',
      list: tabBarList.map((item) => ({
         ...item,
         pagePath: `/${item.pagePath}`,
      })),
   }

   switchTab(index, url) {
      this.setSelected(index)
      Taro.switchTab({ url })
   }

   setSelected(idx: number) {
      this.setState({
         selected: idx,
      })
   }

   render() {
      const { list, selected, color, selectedColor } = this.state

      return (
         <CoverView className='tabBar'>
            <CoverView className='tab-bar-border'></CoverView>
            {list.map((item, index) => {
               return (
                  <CoverView
                     key={index}
                     className='tabBar-item'
                     onClick={this.switchTab.bind(this, index, item.pagePath)}
                  >
                     {/* <CoverImage
                                src={
                                    selected === index
                                        ? item.selectedIconPath
                                        : item.iconPath
                                }
                            /> */}
                     <CoverView
                        className='tabBar-item-text'
                        style={{
                           color: selected === index ? selectedColor : color,
                        }}
                     >
                        {item.text}
                     </CoverView>
                  </CoverView>
               )
            })}
         </CoverView>
      )
   }
}
