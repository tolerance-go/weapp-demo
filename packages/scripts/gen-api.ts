import chokidar from 'chokidar'
import fs from 'fs-extra'
import debounce from 'lodash.debounce'
import path from 'path'
import prettier from 'prettier'
import {
   FileData,
   formatTarget,
   getDirData,
   getGenDistDirPath,
   pagesDirPath,
} from './common'
import {
   convertApiPathToCallOrReturn,
   convertApiPathToFnOrReturn,
   convertApiPathToObjectType,
} from './utils'

import { program } from 'commander'

program
   .option('-h, --apiHost <value>', 'apiHost', 'localhost')
   .option('-p, --apiPort <value>', 'apiPort', '3000')
   .option(
      '-i, --requestImportStr <value>',
      '请求语句',
      `import { request2 as request } from '@yorkbar/utils'`,
   )

program.parse()

const options = program.opts()

const pickFileMeta = (filePath: string) => {
   const content = fs.readFileSync(filePath, {
      encoding: 'utf-8',
   })

   const matches = content.match(/export type meta = {((.|\n)*?)}/)

   if (!matches) {
      return null
   }

   const metaContentStr = matches?.[1]

   const hasReq = metaContentStr.indexOf('req:') > -1
   const hasBody = hasReq && metaContentStr.indexOf('body:') > -1
   const hasQuery = hasReq && metaContentStr.indexOf('query:') > -1
   const hasRes = metaContentStr.indexOf('res:') > -1
   const hasMethod = metaContentStr.indexOf('method:') > -1

   const method = metaContentStr.match(/method: '(.*?)'/)?.[1]

   return {
      method,
      hasMethod,
      hasReq,
      hasBody,
      hasQuery,
      hasRes,
   }
}

// 根据 meta 生成对应的请求函数字符串
const getRequestFnStr = (
   apiImportMetaVar: string,
   apiPath: string,
   hasQuery: boolean,
   hasBody: boolean,
   method: string,
) => {
   const hasParams = !!apiPath.match(/\/\[.*?\]/)
   return `async (
      ${hasQuery ? `query: ${apiImportMetaVar}['req']['query'],` : ''}
      ${hasParams ? `params: ${convertApiPathToObjectType(apiPath)},` : ''}
      ${hasBody ? `body: ${apiImportMetaVar}['req']['body'],` : ''}
      options?: RequestConfig
    ) =>
        request<
            ${hasQuery ? `${apiImportMetaVar}['req']['query'],` : ''}
            ${hasBody ? `${apiImportMetaVar}['req']['body'],` : ''}
            ${apiImportMetaVar}['res']
        >({
            url: ${convertApiPathToCallOrReturn(`apiUrls['${apiPath}']`)},
            method: '${method}',
            ${hasBody ? `data: body,` : ''}
            ${hasQuery ? `params: query,` : ''}
            ...options
        })`
}

const getApiImportMetaVarStr = (apiPath: string) => {
   return (
      apiPath
         .split(/\/|-|\s/)
         .filter(Boolean)
         // [id] => id
         .map((item) => item.replace(/\[(.*?)\]/, '$1'))
         .map((item) => item[0].toUpperCase() + item.slice(1))
         .join('')
   )
}

const getApiImportMetaSentenceStr = (apiPath: string, varStr: string) => {
   return `import { meta as ${varStr} } from '../pages${apiPath}'`
}

const gen = () => {
   console.log('start gen api data.')

   //====================== 处理 pagesData * 开始 ======================

   const distPath = getGenDistDirPath()

   const apiDirData = getDirData(path.join(pagesDirPath, 'api'))
   const apiDataPath = path.join(distPath, 'apiData.ts')

   fs.ensureFileSync(apiDataPath)

   let apiMetaImportStr = ''
   let apiDataKeyVarStr = ''
   let apiUrlsVarStr = ''
   let apiPathVarStr = ''

   const forEachApiDataFromPage = (pagesData: FileData[]) => {
      pagesData.forEach((next) => {
         if (next.isDirectory) {
            return forEachApiDataFromPage(next.children)
         }

         const url = '/' + path.relative(pagesDirPath, next.path)
         const { dir, name } = path.parse(url)
         const apiPath = path.join(dir, name)

         const meta = pickFileMeta(next.path)

         apiUrlsVarStr += `'${apiPath}': ${convertApiPathToFnOrReturn(
            `\`\${API_PREFIX}${apiPath}\``,
         )},\n`

         apiPathVarStr += `'${apiPath}': '${apiPath}',\n`

         if (meta) {
            const importVarStr = getApiImportMetaVarStr(apiPath)
            const importSentenceStr = getApiImportMetaSentenceStr(
               apiPath,
               importVarStr,
            )

            apiMetaImportStr += importSentenceStr + '\n'

            apiDataKeyVarStr += `'${apiPath}': ${getRequestFnStr(
               importVarStr,
               apiPath,
               meta.hasQuery,
               meta.hasBody,
               meta.method ?? 'POST',
            )},\n`

            forEachApiDataFromPage(next.children)
            return
         }

         forEachApiDataFromPage(next.children)
      })
   }

   const requestImportStr = options.requestImportStr
   const apiHost = options.apiHost
   const apiPort = options.apiPort
   forEachApiDataFromPage([apiDirData])

   formatTarget(apiDataPath, (options) => {
      const formatted = prettier.format(
         `
            ${apiMetaImportStr}
            ${requestImportStr}

            export const API_PREFIX = \`\${
               process.env.NODE_ENV === 'development' ? 'http:' : 'https:'
            }//${apiHost}:${apiPort}\`

            export const apiUrls = {
               ${apiUrlsVarStr}
            }

            export const apiData = {
               ${apiDataKeyVarStr}
            }

            export const apiPaths = {
               ${apiPathVarStr}
            }
            `,
         {
            ...options,
            parser: 'typescript',
         },
      )
      fs.writeFileSync(apiDataPath, formatted, {
         encoding: 'utf-8',
      })
   })

   //====================== 处理 pagesData * 结束 ======================
}

const main = () => {
   gen()
   const dGen = debounce(gen, 500)
   chokidar
      .watch('pages/api/**/*.ts', {
         ignoreInitial: true,
      })
      .on('add', dGen)
      .on('unlink', dGen)
      .on('change', dGen)
}

main()
