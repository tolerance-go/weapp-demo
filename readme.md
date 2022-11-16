1. ts-node = tsc index.ts & node index.js

   1. scripts 内不能使用 lodash-es

2. nextjs 项目中 next.configs.js 的 eslint 报错，`Parsing error: Cannot find module 'next/babel'`
   1. `"next/babel"` 加入到 eslintrc 中即可

## 数据库操作

### 新增迁移记录

> pn prisma migrate dev --name xxx

删除 packages/admin/prisma/migrations 然后 执行会提示是否初始化数据库

### 生成客户端代码

> pn prisma generate

## pnpm

~~根目录安装需要指定 -w 参数，然后再指定 -r 按照所有模块依赖~~

## commander

.option('--no-watch', 'unwatch')

设置 --no-xxx，对应 xxx 默认为 true，并且不需要设置简写

## turbo

配置中 "dependsOn": ["^build"],

^ 表示，等待在 package.json 中依赖的 workspace 中项目的 build 先完成

不带 ^ 表示等待 pipeline 的命令先完成（workspace 中声明该命令的，并行的执行）

## ai 去噪音

https://github.com/Sanster/lama-cleaner

lama-cleaner --model=lama --device=cpu --port=8080

## 抠图

https://www.remove.bg/upload

## git

### ignorecase

全局设置大小写敏感

git config --global core.ignorecase false

git mv ...

## turbo

1. outputs 是为了远程 cache 快速生成 outputs 用的
   1. 远程保存了一份 input -> out，用本地 input 和远程 input 比较，如果一样直接拷贝 out 下来
2. outpus 设为空数组，则仅 cache log，注意它确实没有执行，如果命中缓存，仅仅就是把之前缓存的 log 打印一次而已
   1. 默认是 `dist/*`, `build/*`
3. input 默认为当前 npm 包内的所有文件

-  如果需要在包工作区内容变化才执行，cache 不为 false
   -  只缓存 log 的话，outputs 为 `[]`
-  如果不需要在包工作区内容变化才执行，永远都执行
   -  包守护进程不需要
   -  monorepo 子包命令代理不需要

## prisma

push 命令将 schema 修改同步到数据库

一般多次 push 后，执行 db:migrate:dev 生成一个迁移指示文件（应该是对比前后的 schema 文件做决定的）

然后在 ci 上，对应生产分支，执行 db:migrate:deploy，将 diff 的“迁移指示文件”找出来，并同步迁移记录到数据库

### 问题？

1. 如果当前数据无法顺利迁移怎么办？

### 数据库初始化

seed（种子）命令用来初始化数据库，比如 admin 用户

## tsx

比 ts-node 牛逼的地方在于:

在 mandong-admin 里面 ts-node 执行一个 script 中的 ts 文件，如果 script 下存在 tsconfig 文件，会报错内容如下：

`SyntaxError: Cannot use import statement outside a module`

用 tsx 则不会

然后是快，它是用 esbuild 做底层的

## pnpm add

### workspace \* 安装

`pn add @yorkbar/tsconfig@'*' -D`

monorepo 中的子包之间的依赖最佳实践就是锁定版本号

> monorepo 各个包作为一个整体看待，方便维护
> 某个子包发布新版本了，依赖他的包可能会相应发布各种大小的版本

## commit

约定：

```
type(scope): summary

body

footer
```

-  type

   -  version: 版本号
   -  fix
   -  feat
   -  build
   -  ci
   -  chore

-  scope: 子包名称

## monorepo 的依赖怎么装

原则：

1. 遵循我用什么，就装什么，装什么就用什么

问题 1: 如果多个子包都用到一个依赖，那么应该把他装到根目录吗？

NO！！！首先违背第一原则，正确做法应该在用到的子包内安装相同版本（维护问题如果解决？）

好处是

-  其他没有用到依赖的包不会被污染（意外的向上查找）
-  保障子包空间的的独立性

## changeset 工作流

1. 随着每个 commit 执行 pn changeset
2. 准备发布新版本的时候（积累了多个 commit 后），执行 pn version-packages
   1. 将会打印一些信息用来记录到 commit
3. 修改根目录的 package.json 的 version
4. 提交 commit
   git commit -m
   `
   version: ?

   @yorkbar/mandong-hero@1.0.2
   @yorkbar/ui@3.0.2
   @yorkbar/mandong-admin@1.0.2
   @yorkbar/mandong-docs@1.0.2
   @yorkbar/mandong-ide@1.0.2
   @yorkbar/mandong-weapp@1.0.2
   @yorkbar/mandong-core@0.1.2
   @yorkbar/utils@1.0.2
   `

5. 打 git tag
   git tag -a v? -m "@yorkbar/mandong-hero@1.0.2
   @yorkbar/ui@3.0.2
   @yorkbar/mandong-admin@1.0.2
   @yorkbar/mandong-docs@1.0.2
   @yorkbar/mandong-ide@1.0.2
   @yorkbar/mandong-weapp@1.0.2
   @yorkbar/mandong-core@0.1.2
   @yorkbar/utils@1.0.2"
6. 推送 tag 到远程 `git push --follow-tags`

## 删除 git tag

1. 删除本地 tag

git tag -d tag-name

2. 删除远程 tag

git push origin :refs/tags/tag-name
