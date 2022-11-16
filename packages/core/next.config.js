const withTM = require('next-transpile-modules')([
    '@yorkbar/ui',
    '@yorkbar/scripts',
    '@yorkbar/utils',
])

const withMDX = require('@next/mdx')({
    extension: /\.(md|mdx)?$/,
    options: {
        rehypePlugins: [
            require('@mapbox/rehype-prism'),
            require('rehype-join-line'),
        ],
    },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    pageExtensions: ['mdx', 'tsx', 'ts'],
}

module.exports = withTM(withMDX(nextConfig))
