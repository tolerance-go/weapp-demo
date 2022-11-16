// linaria 配置详见 https://github.com/callstack/linaria/blob/master/docs/CONFIGURATION.md#options
module.exports = {
    rules: [
        {
            action: require('@linaria/shaker').default,
        },
        {
            test: (path) => {
                // if (/node_modules\/\.pnpm\/(?!@tarojs)/.test(path)) {
                //     console.log(path)
                // }

                // if (!/node_modules\/\.pnpm\/(?!@tarojs)/.test(path)) {
                //     console.log(path)
                // }
                return /node_modules\/\.pnpm\/(?!@tarojs)/.test(path)
            },
            action: 'ignore',
        },
    ],
}
