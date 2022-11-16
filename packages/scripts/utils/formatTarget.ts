import prettier from 'prettier'


// 格式化指定文件
export const formatTarget = async (
   filePath: string,
   callback: (options: prettier.Options) => void,
) => {
   await prettier.resolveConfig(filePath).then((options) => {
      if (options) {
         callback(options)
      }
   })
}
