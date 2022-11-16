import fs from 'fs-extra'
import path from 'path'
import prettier from 'prettier'
import { formatTarget, getDirData, pagesDirPath } from './common'

const main = () => {
   //====================== 处理 pagesData * 开始 ======================

   const distPath = path.join(process.cwd(), 'gen')

   fs.ensureDirSync(distPath)

   const pagesDirData = getDirData(pagesDirPath)
   const pagesDataPath = path.join(distPath, 'pagesData.ts')

   fs.ensureFileSync(pagesDataPath)

   formatTarget(pagesDataPath, (options) => {
      const formatted = prettier.format(
         `export const pagesData = ${JSON.stringify(pagesDirData)}`,
         {
            ...options,
            parser: 'babel',
         },
      )
      fs.writeFileSync(pagesDataPath, formatted, {
         encoding: 'utf-8',
      })
   })

   //====================== 处理 pagesData * 结束 ======================
}

main()
