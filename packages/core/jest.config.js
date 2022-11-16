const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig')

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
   globalSetup: './.jest/setup.js',
   globalTeardown: './.jest/teardown.js',
   setupFilesAfterEnv: ['<rootDir>/.jest/setupAfterEnv.ts'],
   testEnvironment: './.jest/puppeteer_environment.js',
   roots: ['<rootDir>'],
   transform: {
      // "\\.[jt]sx?$": "babel-jest",
      '^.+\\.tsx?$': [
         'ts-jest',
         {
            // 如果 modulePaths 设置了 <rootDir>，那么这里定制的 tsconfig json 也需要 baseUrl: '.'
            // 如果 moduleNameMapper 设置了 pathsToModuleNameMapper，那么这里定制的 json 也需要 paths
            // tsconfig 中 baseUrl 和 path 总是一起出现的，和 jest-config 中的 modulePaths，moduleNameMapper
            // 需要对应起来
            tsconfig: 'tsconfig-test.json',
         },
      ],
   },
   modulePaths: ['<rootDir>'], // 和下面的语句等价
   // moduleDirectories: ['<rootDir>', 'node_modules'],
   moduleNameMapper: {
      ...pathsToModuleNameMapper(compilerOptions.paths, {
         prefix: '<rootDir>/',
      }),
      '^lodash-es$': 'lodash',
      '^gsap/(.*)$': '<rootDir>/node_modules/gsap/dist/$1',
   },
   transformIgnorePatterns: ['<rootDir>/node_modules/(?!@fenxing)'],
}
