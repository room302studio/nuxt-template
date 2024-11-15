import { defineStore } from 'pinia'
import type { Issue } from '~/types'

export const useAppStore = defineStore('app', () => {
  const itemList = ref<Issue[]>([])
  const selectedModel = ref('anthropic/claude-3.5-sonnet:beta')

  function addItem(item: Issue) {
    itemList.value.push(item)
  }

  function removeItem(item: Issue) {
    const index = itemList.value.indexOf(item)
    if (index > -1) {
      itemList.value.splice(index, 1)
    }
  }

  return {
    itemList,
    selectedModel,
    addItem,
    removeItem
  }
}) 