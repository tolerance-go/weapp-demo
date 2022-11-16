import { formatTarget } from '@yorkbar/scripts/utils/formatTarget'
import path from 'path'
import prettier from 'prettier'
import semver from 'semver'
import 'zx/globals'
import { gerNextVersion, NextVersionData } from './utils/gerNextVersion'
;(async () => {
   const rootPkgJsonPath = path.join(process.cwd(), 'package.json')

   const pkgJSON = require(rootPkgJsonPath)

   const pkgVersion: string | undefined = pkgJSON.version

   if (!pkgVersion) throw new Error('package.json version not find.')

   const nextVersionFilePath = path.join(process.cwd(), 'next-version.json')

   const data: NextVersionData = require(nextVersionFilePath)

   if (!semver.valid(pkgVersion)) {
      throw new Error('pkgVersion valid fail.')
   }

   const nextVersion = gerNextVersion(pkgVersion, data)

   console.log(
      '0. after generate `next-version.json`, run changeset version and change root package.json version\n\n' +
         '1. git commit:\n' +
         `git add . \ngit commit -m "version: ${nextVersion}\n\n${data.releases
            .map((item) => `${item.name}@${item.newVersion}`)
            .join('\n')}"` +
         '\n\n' +
         '2. git tag:\n' +
         `git tag -a v${nextVersion} -m "${data.releases
            // https://stackoverflow.com/a/9305137/20058553
            .map((item) => `${item.name}@${item.newVersion}`)
            .join('\n')}"` +
         '\n\n' +
         '3. git push --follow-tags',
   )

   console.log('\nauto run steps:\n')

   await formatTarget(rootPkgJsonPath, (options) => {
      const formatted = prettier.format(
         JSON.stringify({
            ...pkgJSON,
            version: nextVersion,
         }),
         {
            ...options,
            parser: 'json',
         },
      )
      fs.writeFileSync(rootPkgJsonPath, formatted, {
         encoding: 'utf-8',
      })
   })

   await $`git add . \ngit commit -m "version: ${nextVersion}\n\n${data.releases
      .map((item) => `${item.name}@${item.newVersion}`)
      .join('\n')}"`

   await $`git tag -a v${nextVersion} -m "${data.releases
      // https://stackoverflow.com/a/9305137/20058553
      .map((item) => `${item.name}@${item.newVersion}`)
      .join('\n')}"`

   await $`git push --follow-tags`
})()
