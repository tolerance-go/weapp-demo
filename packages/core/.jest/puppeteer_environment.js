const chalk = require('chalk')
const JSDOMEnvironment = require('jest-environment-jsdom').default
const puppeteer = require('puppeteer')
const fs = require('fs')
const os = require('os')
const path = require('path')

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

/**
 * 因为要测试 x6，它依赖 svg 某些 api，而 jest 的 jsdom 环境模拟不了
 * 所以用无头浏览器环境来定制一下 jsdom
 * 同时支持 dom render 和 e2e 两种测试方式，及最基础的 node，共三种
 */
class PuppeteerEnvironment extends JSDOMEnvironment {
   testPath

   constructor(config, context) {
      super(config, context)

      this.testPath = context.testPath
   }

   async setup() {
      console.log(chalk.yellow('Setup Test Environment.', this.testPath))
      await super.setup()
      const wsEndpoint = fs.readFileSync(path.join(DIR, 'wsEndpoint'), 'utf8')
      if (!wsEndpoint) {
         throw new Error('wsEndpoint not found')
      }
      this.global.__BROWSER__ = await puppeteer.connect({
         browserWSEndpoint: wsEndpoint,
      })
   }

   async teardown() {
      console.log(chalk.yellow('Teardown Test Environment.'))
      await super.teardown()
   }

   runScript(script) {
      return super.runScript(script)
   }
}

module.exports = PuppeteerEnvironment
