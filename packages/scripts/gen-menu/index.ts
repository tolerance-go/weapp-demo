import chokidar from 'chokidar'
import fs from 'fs-extra'
import debounce from 'lodash.debounce'
import path from 'path'
import prettier from 'prettier'
import { FileData, formatTarget, getDirData, pickFileMeta } from '../common'
import { MenuData } from '../typings'
import { genMenuMaps } from '../utils'

import { program } from 'commander'

program.option('-p, --pagesPath <value>', 'pagesPath', 'pages')

program.parse()

const options = program.opts()

const { pagesPath } = options

const pagesDirPath = path.resolve(process.cwd(), pagesPath)

const gen = () => {
   console.log('start gen menu data.')

   const distPath = path.join(process.cwd(), 'gen')

   fs.ensureDirSync(distPath)

   const pagesDirData = getDirData(
      path.resolve(process.cwd(), pagesPath),
      (item, absPath) => !absPath.includes('/api') && !item.startsWith('_'),
   )

   const genMenuDataFromPages = (
      pagesData: FileData[],
      deep = 0,
   ): MenuData[] => {
      return pagesData
         .filter((item) => {
            if (item.isDirectory) return true

            if (['.mdx', '.tsx'].includes(path.parse(item.name).ext))
               return true

            return false
         })
         .map((item) => {
            // 目录的话，meta 从 index 上取
            const meta = (() => {
               if (item.isDirectory) {
                  const indexChild = item.children.find((it) =>
                     it.name.startsWith('index'),
                  )

                  if (!indexChild) {
                     // 如果不这样约定，菜单的结构就不是一个标准的分形结构
                     // 如此，我们可以保证菜单的 url 一定是所有子级 url 的开头
                     // 并且菜单的 url 一定有对应的页面，也就是 index
                     console.warn('文件夹未发现其 index 入口文件，meta 为空')
                     return {
                        isGroup: item.isDirectory,
                        isNav: deep === 1,
                        isIndex: false,
                     }
                  }
                  return {
                     ...pickFileMeta(path.join(item.path, indexChild.name)),
                     isGroup: item.isDirectory,
                     isNav: deep === 1,
                     isIndex: false,
                  }
               }

               return {
                  ...pickFileMeta(item.path),
                  isGroup: deep > 1 && item.isDirectory,
                  isNav: deep === 1,
                  isIndex: path.parse(item.name).name === 'index',
               }
            })()

            const url = (() => {
               /**
                * eg:
                *      relative: useRequest/basic.mdx
                *      dir: useRequest
                *      name: basic
                */
               const relative = path.relative(pagesDirPath, item.path)

               const { dir, name } = path.parse(relative)

               // relative 为空，不能执行 join 会得到一个 .
               return relative
                  ? `/${
                       // 如果文件名称为 index，那么在 url 上应该去除
                       name.startsWith('index') ? dir : path.join(dir, name)
                    }`
                  : ''
            })()

            return {
               key: meta.key ?? url,
               name:
                  // 如果是第一层，则用 navTitle
                  (deep === 1 ? meta?.navTitle : meta?.title) ??
                  // 去除扩展名称
                  path.parse(item.name).name,
               url,
               order:
                  (meta.isNav
                     ? meta.navOrder ?? meta.order
                     : meta.isGroup
                     ? meta.groupOrder ?? meta.order
                     : meta.order) ?? 0,
               meta,
               children: genMenuDataFromPages(item.children, deep + 1),
            }
         })
         .sort((a, b) => a.order - b.order)
   }

   const menuDataPath = path.join(distPath, 'menuData.ts')
   const menuData = genMenuDataFromPages([pagesDirData])

   fs.ensureFileSync(menuDataPath)

   formatTarget(menuDataPath, (options) => {
      const formatted = prettier.format(
         `export const menuData = ${JSON.stringify(menuData[0].children)}
       export const menuMaps = ${JSON.stringify(
          genMenuMaps(menuData[0].children),
       )}`,
         {
            ...options,
            parser: 'babel',
         },
      )
      fs.writeFileSync(menuDataPath, formatted, {
         encoding: 'utf-8',
      })
   })
}

const main = () => {
   gen()
   const dGen = debounce(gen, 500)

   // 如果文件夹中 index 没有 groupTitle 相关参数，那么文件夹的名称会影响生成的 menuData
   chokidar
      .watch(`${pagesPath}/**`, {
         // 路径匹配
         ignored: /\/_|\/api/,
         ignoreInitial: true,
      })
      .on('addDir', dGen)
      .on('unlinkDir', dGen)

   chokidar
      .watch(`${pagesPath}/**/*.(tsx|mdx)`, {
         // 路径匹配
         ignored: /\/_|\/api/,
         ignoreInitial: true,
      })
      .on('add', dGen)
      .on('change', dGen)
      .on('unlink', dGen)
}

main()
