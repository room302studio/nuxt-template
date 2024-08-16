// Import necessary functions from Vue and VueUse
import { createGlobalState, useLocalStorage } from '@vueuse/core'

// Define the global state using createGlobalState from VueUse
export const useAppStore = createGlobalState(() => {
  // useLocalStorage is a VueUse function that creates a ref linked to a localStorage key.
  // It takes two arguments: the localStorage key and the default value.
  const activeItem = useLocalStorage('activeItem', null)
  const itemList = useLocalStorage('itemList', [])

  // Define actions that mutate the state. These are functions that modify the refs.
  const setActiveItem = (item) => {
    activeItem.value = item
  }

  const addItem = (item) => {
    itemList.value.push(item)
  }

  const removeItem = (item) => {
    const index = itemList.value.indexOf(item)
    if (index !== -1) {
      itemList.value.splice(index, 1)
    }
  }

  // The object returned here will be the global state that can be accessed in any component.
  return {
    activeItem,
    itemList,
    setActiveItem,
    addItem,
    removeItem,
  }
})