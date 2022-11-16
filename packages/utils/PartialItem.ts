export type PartialItem<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
