<template>
  <div :id="`issue-${index}`"
    class="p-4 border rounded-md group relative bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-md transition-all scroll-mt-4"
    :class="{
      'animate-new-issue': issue.history?.splitFrom || issue.history?.combinedFrom,
      'animate-fade-out': issue.skeleton && hasRealIssues
    }">
    <div class="flex justify-between items-start">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <h3 class="font-medium text-lg dark:text-white">
            {{ issue.title }}
          </h3>
          <!-- Combined from badge -->
          <span v-if="issue.history?.combinedFrom"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
            :title="combinedFromTitles">
            Combined
            <Icon name="heroicons:arrows-pointing-in-mini" class="w-4 h-4 ml-1" />
          </span>
        </div>
        <p v-if="issue.history?.combinedFrom" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          from: {{ combinedFromTitles }}
        </p>
      </div>

      <div class="flex gap-2">
        <button @click="emit('split')"
          class="text-gray-400 hover:text-purple-500 dark:text-gray-500 dark:hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Split into two issues">
          <Icon name="material-symbols-light:arrow-split-rounded" class="w-5 h-5" />
        </button>
        <button @click="emit('remove')"
          class="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <Icon name="heroicons:trash" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div class="prose prose-sm max-w-none text-gray-600 dark:text-gray-300 dark:prose-invert" v-html="renderedBody" />

    <p v-if="issue.history?.splitFrom"
      class="mt-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2">
      Split from: "{{ issue.history.splitFrom.title }}"
    </p>

    <!-- History Section -->
    <div v-if="issue.history?.combinedFrom?.length" class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-2">
      <button @click="isHistoryOpen = !isHistoryOpen"
        class="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
        <Icon :name="isHistoryOpen ? 'heroicons:chevron-down' : 'heroicons:chevron-right'" class="w-4 h-4" />
        Combined from {{ issue.history.combinedFrom.length }} issues
      </button>

      <div v-show="isHistoryOpen" class="mt-2 space-y-3">
        <div v-for="(originalIssue, idx) in issue.history.combinedFrom" :key="idx"
          class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md border border-gray-200 dark:border-gray-600">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ originalIssue.title }}</h4>
          <div class="prose prose-sm max-w-none text-gray-600 dark:text-gray-400 mt-1"
            v-html="renderMarkdown(originalIssue.body)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Issue } from '~/types'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const props = defineProps<{
  issue: Issue
  index: number
  hasRealIssues?: boolean
}>()

const emit = defineEmits<{
  remove: []
  split: []
}>()

// Markdown rendering
const renderedBody = computed(() => {
  return DOMPurify.sanitize(marked(props.issue.body))
})

function renderMarkdown(text: string) {
  return DOMPurify.sanitize(marked(text))
}

// Add computed for combined titles
const combinedFromTitles = computed(() => {
  if (!props.issue.history?.combinedFrom) return ''
  return props.issue.history.combinedFrom
    .map(issue => `"${issue.title}"`)
    .join(' + ')
})
</script>

<style scoped>
@keyframes flutter {
  0% {
    opacity: 0;
    transform: translateY(-20px) rotate(-2deg);
  }

  30% {
    opacity: 0.5;
    transform: translateY(5px) rotate(1deg);
  }

  60% {
    transform: translateY(-2px) rotate(-0.5deg);
  }

  80% {
    transform: translateY(1px) rotate(0.25deg);
  }

  100% {
    opacity: 1;
    transform: translateY(0) rotate(0);
  }
}

@keyframes shadow-flutter {
  0% {
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  }

  30% {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  100% {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
}

.animate-flutter {
  animation:
    flutter 0.8s cubic-bezier(0.23, 1, 0.32, 1) backwards,
    shadow-flutter 0.8s cubic-bezier(0.23, 1, 0.32, 1) backwards;
}

/* Stagger the animations for multiple issues */
div:nth-child(2) .animate-flutter {
  animation-delay: 0.1s;
}

div:nth-child(3) .animate-flutter {
  animation-delay: 0.2s;
}

div:nth-child(4) .animate-flutter {
  animation-delay: 0.3s;
}

div:nth-child(5) .animate-flutter {
  animation-delay: 0.4s;
}

.cursor-grab {
  cursor: grab;
}

.cursor-grabbing {
  cursor: grabbing;
}

/* Add Tailwind Typography styles */
.prose {
  @apply text-gray-600;
}

.prose p {
  @apply my-2;
}

.prose ul {
  @apply list-disc pl-4 my-2;
}

.prose ol {
  @apply list-decimal pl-4 my-2;
}

.prose code {
  @apply bg-gray-100 px-1 rounded;
}

/* Enhance drop target animation */
@keyframes pulse-border {

  0%,
  100% {
    border-color: rgba(167, 139, 250, 0.5);
  }

  50% {
    border-color: rgba(167, 139, 250, 1);
  }
}

.animate-pulse-border {
  animation: pulse-border 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Update the hover-pulse animation to be less dramatic */
@keyframes hover-pulse {

  0%,
  100% {
    transform: scale(1.01);
  }

  50% {
    transform: scale(1.005);
  }
}

/* Apply the hover animation when isHovered is true */
.animate-hover-pulse {
  animation: hover-pulse 2s ease-in-out infinite;
}

/* Add specific transitions for non-drag states */
.hover\:bg-gray-50 {
  transition: background-color 0.2s ease;
}

.hover\:shadow-md {
  transition: box-shadow 0.2s ease;
}

@keyframes highlight-fade {
  0% {
    background-color: rgb(167 139 250 / 0.2);
    border-color: rgb(167 139 250 / 1);
  }

  70% {
    background-color: rgb(167 139 250 / 0.1);
    border-color: rgb(167 139 250 / 0.5);
  }

  100% {
    background-color: transparent;
    border-color: rgb(229 231 235 / 1);
    /* Tailwind border-gray-200 */
  }
}

.animate-new-issue {
  animation: highlight-fade 4s ease-out forwards;
}

/* Dark mode version */
@media (prefers-color-scheme: dark) {
  .animate-new-issue {
    animation-name: highlight-fade-dark;
  }

  @keyframes highlight-fade-dark {
    0% {
      background-color: rgb(167 139 250 / 0.2);
      border-color: rgb(167 139 250 / 1);
    }

    70% {
      background-color: rgb(167 139 250 / 0.1);
      border-color: rgb(167 139 250 / 0.5);
    }

    100% {
      background-color: transparent;
      border-color: rgb(75 85 99 / 1);
      /* Tailwind dark:border-gray-600 */
    }
  }
}

@keyframes fade-out {
  0% {
    opacity: 1;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY(-10px);
    display: none;
  }
}

.animate-fade-out {
  animation: fade-out 0.3s ease-out forwards;
}
</style>