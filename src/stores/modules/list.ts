import { defineStore } from 'pinia'

const useListStore = defineStore('calcList', () => {
  const list = ref([])

  const addToList  = result => {
    if (list.value.length > 5) {
      list.value.shift()
    }

    list.value.unshift(result)
  }

  return {
    list,
    addToList,
  }
}, {
  persist: true,
})

export default useListStore
