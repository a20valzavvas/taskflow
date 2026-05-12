<template>
  <div
    :class="[
      'rounded-2xl p-4 border transition-all',
      task.status === 'completed'
        ? 'bg-cream/60 border-sand/30 opacity-60'
        : 'bg-paper border-sand/50 hover:border-sand shadow-sm hover:shadow-md hover:shadow-sand/20',
    ]"
  >
    <div class="flex items-start gap-3">
      <button
        @click="$emit('toggle', task.id)"
        :class="[
          'mt-0.5 flex-shrink-0 transition-colors',
          task.status === 'completed' ? 'text-olive' : 'text-sand hover:text-olive',
        ]"
      >
        <CheckCircle2 v-if="task.status === 'completed'" class="w-5 h-5" />
        <Circle v-else class="w-5 h-5" />
      </button>

      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <span
            :class="[
              'text-sm font-medium',
              task.status === 'completed' ? 'line-through text-olive-light/60' : 'text-olive-dark',
            ]"
          >
            {{ task.title }}
          </span>
          <span :class="['text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 border', priorityClass]">
            <component :is="priorityIcon" class="w-3 h-3" />
            {{ priorityLabel }}
          </span>
        </div>

        <p v-if="task.description" class="text-sm text-olive-light mt-1 leading-relaxed">
          {{ task.description }}
        </p>

        <div class="flex items-center gap-3 mt-2 text-xs text-sand">
          <span class="flex items-center gap-1">
            <Clock class="w-3 h-3" />
            {{ formatDate(task.createdAt) }}
          </span>
          <span v-if="task.dueDate" :class="['flex items-center gap-1', isDueSoon ? 'text-brown font-medium' : '']">
            <CalendarClock class="w-3 h-3" />
            {{ formatDate(task.dueDate) }}
          </span>
        </div>
      </div>

      <button
        @click="$emit('delete', task.id)"
        class="text-sand/60 hover:text-brown transition-colors flex-shrink-0 mt-0.5"
      >
        <Trash2 class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, Circle, Flame, Minus, ArrowDown, Clock, CalendarClock, Trash2 } from 'lucide-vue-next'
import type { Task } from '~/composables/useTasks'

const props = defineProps<{ task: Task }>()
defineEmits<{ toggle: [id: string]; delete: [id: string] }>()

const priorityClass = computed(() => ({
  high: 'bg-brown/10 text-brown border-brown/20',
  medium: 'bg-steel/20 text-[#4a7aaa] border-steel/30',
  low: 'bg-olive/10 text-olive border-olive/20',
}[props.task.priority]))

const priorityLabel = computed(() => ({
  high: 'Alta',
  medium: 'Mitjana',
  low: 'Baixa',
}[props.task.priority]))

const priorityIcon = computed(() => ({
  high: Flame,
  medium: Minus,
  low: ArrowDown,
}[props.task.priority]))

const isDueSoon = computed(() => {
  if (!props.task.dueDate) return false
  const diff = new Date(props.task.dueDate).getTime() - Date.now()
  return diff < 86400000 * 2
})

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ca-ES', { day: 'numeric', month: 'short' })
</script>
