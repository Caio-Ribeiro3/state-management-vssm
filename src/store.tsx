export type Storage = Record<string | number, unknown>
export type Observer<T = unknown> = (payload: T) => void

export class Store {
  private static store: Store
  private storage: Storage = {}
  private observers: Record<keyof Storage, Observer<any>[]> = {}

  private constructor() {}

  static getInstance() {
    if (!Store.store) {
      Store.store = new Store()
    }

    return Store.store
  }

  get<T>(payload: { key: keyof Storage }) {
    return this.storage[payload.key] as T
  }

  set<T extends keyof Storage>(payload: { key: T; value: Storage[T] }) {
    this.storage[payload.key] = payload.value
    this.notify({ key: payload.key, value: payload.value })
  }

  subscribe<T>(payload: { key: keyof Storage; observer: Observer<T> }) {
    this.observers[payload.key] = this.observers[payload.key]
      ? [...this.observers[payload.key], payload.observer]
      : [payload.observer]
  }

  unsubscribe<T>(payload: { key: keyof Storage; observer: Observer<T> }) {
    this.observers[payload.key] = this.observers[payload.key].filter((fn) => fn !== payload.observer)
  }

  notify<T extends keyof Storage>(payload: { key: T; value: Storage[T] }) {
    this.observers[payload.key].forEach((callback) => {
      callback(payload.value)
    })
  }
}
