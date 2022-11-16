export type MenuMeta<Extra = unknown> = {
   key?: string
   title?: string
   order?: number
   path?: string
   groupOrder?: number
   navOrder?: number
   groupTitle?: string
   navTitle?: string
   isNav: boolean
   isGroup: boolean
   // 是否为 index 文件
   isIndex: boolean
} & Extra

export type MenuData<Extra = unknown> = {
   key: string
   name: string
   url: string
   order: number
   meta: MenuMeta<Extra>
   children: MenuData[]
}

export type ApiMeta = {
   method: 'POST' | 'GET'
   req: {
      body: Record<string, any>
      query: Record<string, any>
   }
   res: any
}
