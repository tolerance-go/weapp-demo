import { RouterContext } from 'next/dist/shared/lib/router-context' // next 12

import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport'

const customViewports = {
    kindleFire2: {
        name: 'Kindle Fire 2',
        styles: {
            width: '600px',
            height: '963px',
        },
    },
    kindleFireHD: {
        name: 'Kindle Fire HD',
        styles: {
            width: '533px',
            height: '801px',
        },
    },
}

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    nextRouter: {
        Provider: RouterContext.Provider,
    },
    viewport: {
        viewports: {
            ...MINIMAL_VIEWPORTS,
            ...customViewports,
        },
    },
    options: {
        storySort: (a, b) => {
            //====================== mdx 文件排在最前面 * 开始 ======================

            if (a[2].docs && !b[2].docs) {
                return -1
            }
            if (!a[2].docs && b[2].docs) {
                return 1
            }

            //====================== mdx 文件排在最前面 * 结束 ======================

            return a[1].kind === b[1].kind
                ? 0
                : a[1].id.localeCompare(b[1].id, undefined, { numeric: true })
        },
    },
}
