import fs from 'fs-extra'
import path from 'path'
import { MenuMeta } from './typings'

export * from './utils/formatTarget'

export type FileData = {
   path: string
   name: string
   children: FileData[]
   isDirectory: boolean
}

// 将文件夹转换为内存数据
export const getDirData = (
   dirPath: string,
   filter?: (name: string, path: string) => boolean,
) => {
   const getData = (filePath: string): FileData => {
      const isDirectory = fs.statSync(filePath).isDirectory()
      const fileData = {
         path: filePath,
         isDirectory,
         name: path.basename(filePath),
         children: isDirectory
            ? fs
                 .readdirSync(filePath)
                 .filter((item) =>
                    filter ? filter(item, path.join(filePath, item)) : true,
                 )
                 .map((dirName) => {
                    return getData(path.join(filePath, dirName))
                 })
            : [],
      }

      return fileData
   }

   if (!fs.statSync(dirPath).isDirectory()) {
      throw new Error('dir must')
   }
   return getData(dirPath)
}



export const pagesDirPath = path.resolve(process.cwd(), 'pages')

export const getGenDistDirPath = () => {
   const distPath = path.join(process.cwd(), 'gen')

   fs.ensureDirSync(distPath)

   return distPath
}

// 暂时通过正则获取 meta，因为有的 tsx 文件内使用了 dynamic，导致 extract-mdx-metadata 报错了
export const pickFileMeta = (filePath: string): MenuMeta => {
   const content = fs.readFileSync(filePath, {
      encoding: 'utf-8',
   })

   return Object.fromEntries(
      content
         .match(/export const meta = {((.|\n)*?)}/)?.[1]
         .split(',')
         .filter((item) => Boolean(item) && item !== '\n')
         .map((item) => item.trim().split(':'))
         .map(([key, val]) => {
            const trimVal = val.trim()
            if (isNaN(Number(trimVal)) === false) {
               return [key, Number(trimVal)]
            }
            if (trimVal === 'true') {
               return [key, true]
            }
            if (trimVal === 'false') {
               return [key, false]
            }
            if (trimVal.match(/\[.*\]/)) {
               return [key, eval(trimVal)]
            }
            return [key, trimVal.replace(/(^'|'$)/g, '')]
         }) ?? [],
   ) as MenuMeta
}
