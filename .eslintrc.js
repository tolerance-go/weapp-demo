module.exports = {
   root: true,
   // This tells ESLint to load the config from the package `eslint-config-custom`
   extends: ['@yorkbar/eslint-config-custom'],
   settings: {
      next: {
         // https://nextjs.org/docs/basic-features/eslint#rootdir
         rootDir: [
            'apps/mandong-admin/',
            'apps/mandong-blog/',
            'apps/mandong-docs/',
            'apps/mandong-hero/',
            'apps/mandong-ide/',
            'packages/mandong-core-stories/',
            'packages/mandong-core'
         ],
      },
   },
}
