// const path = require('path')

module.exports = {
    stories: [
        '../**/__stories__/*.@(tsx|mdx)',
    ],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        'storybook-addon-next-router',
    ],
    features: {
        previewMdx2: true,
    },
    babel: async (options) => ({
        ...options,
        plugins: [...options.plugins, 'styled-jsx/babel'],
    }),
    webpackFinal: async (config, { configType }) => {
        // config.resolve.alias = {
        //     ...config.resolve.alias,
        //     '@/examples': path.resolve(__dirname, '../examples'),
        // }

        return config
    },
}
