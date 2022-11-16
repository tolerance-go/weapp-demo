// useLayoutEffect 在 ssr 的服务端渲染的时候会报警告
// useLayoutEffect 在服务端渲染 toString 的时候，什么都不会做
// 可以使用下面的函数，它根据 window 判断环境使用不同的 effect
// 请保证代码在服务端 useEffect 阶段执行的时候不会出现非预期行为
// https://medium.com/@alexandereardon/uselayouteffect-and-ssr-192986cdcf7a

import { useEffect, useLayoutEffect } from 'react'
import { isServer } from './isServer'

export const useIsomorphicLayoutEffect = isServer ? useEffect : useLayoutEffect
