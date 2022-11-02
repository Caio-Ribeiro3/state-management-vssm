import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { Store } from './store'

export function useStore<T>(key: keyof Storage, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const store = Store.getInstance()

  const [value, setValue] = useState<T>(store.get<T>({ key }) ?? initialValue)

  useEffect(() => {
    function observer(args: T) {
      if (value !== store.get<T>({ key })) {
        setValue(args)
      }
    }

    store.subscribe({ key, observer })

    return () => {
      store.unsubscribe({ key, observer })
    }
  }, [])

  useEffect(() => {
    store.set({ key, value })
  }, [value])

  return [value, setValue]
}
