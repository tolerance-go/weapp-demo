/** 具有类型提示的 Omit */
export type OmitItem<T, K extends keyof T> = Omit<T, K>
