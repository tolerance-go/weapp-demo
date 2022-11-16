import semver from 'semver'

export type NextVersionData = {
    changesets: {
       releases: {
          name: string
          type: 'major' | 'minor' | 'patch'
       }[]
    }[]
    releases: {
       name: string
       type: string
       oldVersion: string
       changesets: string[]
       newVersion: string
    }[]
 } 

export const gerNextVersion = (pkgVersion: string, data: NextVersionData) => {
   const parsed = semver.parse(pkgVersion)

   if (!parsed) throw new Error('pkgVersion parsed fail.')

   let bumpWithMajor: boolean = false
   let bumpWithMinor: boolean = false
   let bumpWithPatch: boolean = false

   data.changesets.forEach((item) => {
      item.releases.forEach((it) => {
         if (it.type === 'major') {
            bumpWithMajor = true
         } else if (it.type === 'minor') {
            bumpWithMinor = true
         } else if (it.type === 'patch') {
            bumpWithPatch = true
         }
      })
   })

   const { major, minor, patch } = parsed

   if (major === undefined || minor === undefined || patch === undefined) {
      throw new Error('[major, minor, patch] parsed fail.')
   }

   const nextVersion = [
      bumpWithMajor ? major + (bumpWithMajor ? 1 : 0) : parsed.major,
      bumpWithMajor
         ? 0
         : bumpWithMinor
         ? minor + (bumpWithMinor ? 1 : 0)
         : parsed.minor,
      bumpWithMajor || bumpWithMinor
         ? 0
         : bumpWithPatch
         ? patch + (bumpWithPatch ? 1 : 0)
         : parsed.patch,
   ].join('.')

   return nextVersion
}
