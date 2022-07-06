
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'



let searchStoreIn = (set => ({
  searchs: [],
  setSearch: (newSearch) => set(state => ({
    searchs: [...state.searchs, { id: state.searchs.length + 1, ...newSearch }]
  })),

  removeSearch: (id) =>
    set(state => ({
      searchs: state.searchs.filter((search) => search.id !== id)
    })),
  resetSearch: () =>
    set(() => ({
      searchs: []
    })),

  addGraphData: (symbol, data) => {
    set(state => ({
      searchs:[ Object.assign(
        state.searchs.filter((search) => search["Symbol"] == symbol)[0],
        { chartData: data })]
    }))
  }
}))

let notificationStoreIn = (set => ({
  notifications: [],
  setNotifications: (message) => set(() => ({
    notifications: [message]
  })),
  removeNotifications: () => set(() => ({
    notifications: []
  })),

}))


searchStoreIn = devtools(searchStoreIn)
searchStoreIn = persist(searchStoreIn, { name: 'dataState' })
export const searchStore = create(searchStoreIn)


notificationStoreIn = devtools(notificationStoreIn)
export const notificationStore = create(notificationStoreIn)