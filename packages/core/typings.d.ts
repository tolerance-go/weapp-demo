import 'jquery'
import { Browser } from 'puppeteer'
import { MutableRefObject } from 'react'
import { StageAPIType } from 'Stage'

declare global {
   var __BROWSER__: Browser
   var jquery: JQueryStatic
}
