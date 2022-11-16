import chokidar from 'chokidar'
import fs from 'fs-extra'
import glob from 'glob'
import debounce from 'lodash.debounce'
import path from 'path'
import prettier from 'prettier'
import { formatTarget, getGenDistDirPath, pickFileMeta } from './common'
import { MenuMeta } from './typings'

import { program } from 'commander'

const defaultMatches = './**/__stories__/**/*.@(tsx|mdx)'

program
   .option('--no-watch', 'unwatch')
   .option('-i, --ignore <value>', 'ignore')
   .option('-ii, --ignoreInitial <value>', 'ignoreInitial', false)
   .option('-m, --matches <value>', `default ${defaultMatches}`, defaultMatches)

program.parse()

const options = program.opts()

const { watch, ignore, matches, ignoreInitial } = options
const ignores = [ignore, './node_modules/**'].filter(Boolean)

const cwd = process.cwd()

const distPath = getGenDistDirPath()
const storiesDataPath = path.join(distPath, 'storiesData.ts')
const pagesDirPath = path.resolve(process.cwd(), 'pages')

type StoryData = {
   absFileName: string
   meta: MenuMeta
}

type StoriesData = Record<string, StoryData>

const requireStoriesData = () => {
   delete require.cache[require.resolve(storiesDataPath)]
   const storiesData = require(storiesDataPath).storiesData as StoriesData
   return storiesData
}

/** 获取在 pages 下准备生成的路径 */
const getPageDistPath = (item: StoryData) => {
   /**
    * /a/b/c 如果没有指定 path 使用相对于最近的 __stories__ 的路径
    */
   const index = item.absFileName.lastIndexOf('__stories__')
   const __stories__folderPath = item.absFileName.slice(0, index)

   const __stories__folderName = path.parse(__stories__folderPath).name
   const __stories__path = path.join(__stories__folderPath, '__stories__')

   const { dir, name } = path.parse(
      path.relative(__stories__path, item.absFileName),
   )

   const pagePath =
      item.meta.path ?? path.join(__stories__folderName, dir, name)

   const ext = path.extname(item.absFileName)

   const pageDistPath = path.join(pagesDirPath, `${pagePath}${ext}`)

   return pageDistPath
}

const getStoriesDataKey = (fileName: string, pathKey?: string) => {
   // 结合 path 做 key，不然如果只修改 path 的，未移动文件的话，无法检测到文件路径变化
   // pages 中的就文件无法删除
   return `${fileName}${pathKey ? `__${pathKey}` : ''}`
}

const genStories = async () => {
   console.log('start gen stories data.')

   const files = glob.sync(matches, {
      ignore: ignores,
   })

   // console.log('query stories files', files)

   const storiesData = files.reduce((acc, fileRelPath) => {
      const absFileName = path.join(cwd, fileRelPath)
      const meta = pickFileMeta(absFileName)

      if (Object.keys(meta).length === 0) return acc

      return {
         ...acc,
         [getStoriesDataKey(fileRelPath, meta.path)]: {
            absFileName,
            meta,
         },
      }
   }, {} as StoriesData)

   if (fs.pathExistsSync(storiesDataPath)) {
      const prevStoriesData = requireStoriesData()
      /** 找到删除的 */
      Object.entries(prevStoriesData).forEach(([fileRelPath, item]) => {
         if (
            storiesData[getStoriesDataKey(fileRelPath, item.meta.path)] ===
            undefined
         ) {
            const pageDistPath = getPageDistPath(item)

            console.log('unlink pageDistPath', pageDistPath)
            if (fs.pathExistsSync(pageDistPath)) {
               fs.unlinkSync(pageDistPath)
            }

            const upDirs = path
               .relative(pagesDirPath, path.dirname(pageDistPath))
               // [a,b,c]
               .split(path.sep)
               .filter(Boolean)
               // ['a', 'a/b', 'a/b/c', ]
               .reduce((acc, next) => {
                  return acc.concat(
                     (acc[acc.length - 1] ? [acc[acc.length - 1]] : [])
                        .concat(next)
                        .join(path.sep),
                  )
               }, [] as string[])
               .reverse()

            console.log('upDirs', upDirs)

            if (upDirs.length) {
               // 防止删掉空的 pages
               upDirs.forEach((item) => {
                  const dir = path.join(pagesDirPath, item)
                  /** 如果文件夹为空则删除 */
                  if (fs.readdirSync(dir).length === 0) {
                     console.log('remove dir', dir)

                     fs.rmdirSync(dir)
                  }
               })
            }
         }
      })
   }

   fs.ensureFileSync(storiesDataPath)

   await formatTarget(storiesDataPath, (options) => {
      const formatted = prettier.format(
         `
             export const storiesData = ${JSON.stringify(storiesData)}
         `,
         {
            ...options,
            parser: 'typescript',
         },
      )

      fs.writeFileSync(storiesDataPath, formatted, {
         encoding: 'utf-8',
      })
   })
}

const genPagesFromStories = async () => {
   if (fs.pathExistsSync(storiesDataPath)) {
      const storiesData = requireStoriesData()

      //   console.log(storiesDataPath, storiesData)

      await Promise.all(
         Object.entries(storiesData).map(([key, item]) => {
            if (!item.meta.path)
               console.warn('meta.path not find, use dir path')

            const parsedPath = path.parse(item.absFileName)

            const { ext } = parsedPath

            const pageDistPath = getPageDistPath(item)

            fs.ensureFileSync(pageDistPath)

            if (ext === '.mdx') {
               return formatTarget(pageDistPath, (options) => {
                  const formatted = prettier.format(
                     fs.readFileSync(item.absFileName, { encoding: 'utf-8' }),
                     {
                        ...options,
                        parser: 'mdx',
                     },
                  )

                  fs.writeFileSync(pageDistPath, formatted, {
                     encoding: 'utf-8',
                  })
               })
            } else if (ext === '.tsx') {
               return formatTarget(pageDistPath, (options) => {
                  const formatted = prettier.format(
                     `
                       import Story from '${path.join(
                          parsedPath.dir,
                          parsedPath.name,
                       )}'

                       export const meta = ${JSON.stringify(item.meta)}

                       export default () => <Story />
                   `,
                     {
                        ...options,
                        parser: 'typescript',
                     },
                  )
                  fs.writeFileSync(pageDistPath, formatted, {
                     encoding: 'utf-8',
                  })
               })
            }
         }),
      )
   }
}

const gen = async () => {
   await genStories()
   await genPagesFromStories()
}

const main = async () => {
   if (!ignoreInitial) {
      await gen()
   }

   console.log('watch', watch, typeof watch)

   if (watch) {
      const dGen = debounce(gen, 500)

      chokidar
         .watch(matches, {
            ignoreInitial: true,
            ignored: ignores,
         })
         .on('add', dGen)
         .on('unlink', dGen)
         .on('change', dGen)
         .on('addDir', dGen)
         .on('unlinkDir', dGen)
   }
}

main()
