import { prismaClient } from '.'

import type { User } from '@prisma/client'

const DEFAULT_USERS = [
   // Add your own user to pre-populate the database with
   {
      password: '123',
      username: 'yarnb',
      isAdmin: true,
      email: '892728595@qq.com',
   },
] as Array<Omit<User, 'id'>>

;(async () => {
   try {
      await Promise.all(
         DEFAULT_USERS.map((user) =>
            prismaClient.user.upsert({
               where: {
                  email: user.email ?? undefined,
               },
               update: {
                  ...user,
               },
               create: {
                  ...user,
               },
            }),
         ),
      )
   } catch (error) {
      console.error(error)
      process.exit(1)
   } finally {
      await prismaClient.$disconnect()
   }
})()
