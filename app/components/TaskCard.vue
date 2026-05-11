<template>
  <div
    :class="[
      'rounded-xl p-4 border transition-all',
      task.status === 'completed'
        ? 'bg-slate-800/50 border-slate-700/50 opacity-60'
        : 'bg-slate-800 border-slate-700',
    ]"
  >
    <div class="flex items-start gap-3">
      <button
        @click="$emit('toggle', task.id)"
        :class="[
          'mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors',
          task.status === 'completed'
            ? 'bg-indigo-500 border-indigo-500'
            : 'border-slate-500 hover:border-indigo-400',
        ]"
      >
        <svg
          v-if="task.status === 'completed'"
          class="w-3 h-3 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="3"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </button>

      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <span
            :class="[
              'text-sm font-medium',
              task.status === 'completed' ? 'line-through text-slate-400' : 'text-white',
            ]"
          >
            {{ task.title }}
          </span>
          <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', priorityClass]">
            {{ priorityLabel }}
          </span>
        </div>

        <p v-if="task.description" class="text-sm text-slate-400 mt-1">
          {{ task.description }}
        </p>

        <div class="flex items-center gap-3 mt-2 text-xs text-slate-500">
          <span>{{ formatDate(task.createdAt) }}</span>
          <span v-if="task.dueDate" :class="isDueSoon ? 'text-amber-400' : ''">
            Límit: {{ formatDate(task.dueDate) }}
          </span>
        </div>
      </div>

      <button
        @click="$emit('delete', task.id)"
        class="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from "~/composables/useTasks";

const props = defineProps<{ task: Task }>();
defineEmits<{ toggle: [id: string]; delete: [id: string] }>();

const priorityClass = computed(() => ({
  high: "bg-red-500/20 text-red-400",
  medium: "bg-amber-500/20 text-amber-400",
  low: "bg-green-500/20 text-green-400",
}[props.task.priority]));

const priorityLabel = computed(() => ({
  high: "Alta",
  medium: "Mitjana",
  low: "Baixa",
}[props.task.priority]));

const isDueSoon = computed(() => {
  if (!props.task.dueDate) return false;
  const diff = new Date(props.task.dueDate).getTime() - Date.now();
  return diff < 86400000 * 2;
});

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ca-ES", { day: "numeric", month: "short" });
</script>
