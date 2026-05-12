<template>
  <div class="min-h-screen bg-lavender">
    <header class="bg-paper border-b border-sand/40 px-6 py-4 flex items-center justify-between shadow-sm">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 bg-olive rounded-xl flex items-center justify-center shadow-md shadow-olive/30">
          <CheckSquare class="w-4 h-4 text-paper" />
        </div>
        <div class="flex flex-col leading-tight">
          <span class="font-bold text-lg tracking-tight text-olive-dark">TaskFlow</span>
          <span class="text-[10px] text-sand tracking-wide uppercase">organitza el teu dia</span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <button
            v-for="t in themes"
            :key="t.id"
            @click="setTheme(t.id)"
            :title="t.label"
            :style="theme === t.id
              ? { backgroundColor: t.color, outline: `2px solid ${t.color}`, outlineOffset: '2px' }
              : { backgroundColor: t.color }"
            :class="[
              'w-5 h-5 rounded-full transition-all duration-200 flex-shrink-0',
              theme === t.id ? 'shadow-md scale-110' : 'opacity-40 hover:opacity-75 hover:scale-105',
            ]"
          />
        </div>

        <button
          @click="showChat = !showChat"
          :class="[
            'flex items-center gap-2 text-sm px-4 py-2 rounded-xl border transition-all font-medium',
            showChat
              ? 'bg-olive text-paper border-olive shadow-md shadow-olive/30'
              : 'bg-cream border-sand/60 text-olive hover:border-olive/50 hover:bg-sand/20',
          ]"
        >
          <Transition name="icon" mode="out-in">
            <Bot v-if="showChat" key="on" class="w-4 h-4" />
            <BotOff v-else key="off" class="w-4 h-4" />
          </Transition>
          Assistent IA
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-6 flex gap-6">
      <div class="flex-1 space-y-5 min-w-0">
        <TaskForm />

        <div class="flex gap-2 flex-wrap items-center">
          <button
            v-for="s in statusOptions"
            :key="s.value"
            @click="filterStatus = s.value"
            :class="[
              'text-xs px-3 py-1.5 rounded-full border transition-all font-medium',
              filterStatus === s.value
                ? 'bg-olive text-paper border-olive'
                : 'bg-paper border-sand/60 text-olive-light hover:border-olive/40 hover:text-olive',
            ]"
          >
            {{ s.label }}
          </button>
          <span class="w-px h-4 bg-sand/60 mx-1"></span>
          <button
            v-for="p in priorityOptions"
            :key="p.value"
            @click="filterPriority = p.value"
            :class="[
              'text-xs px-3 py-1.5 rounded-full border transition-all font-medium',
              filterPriority === p.value
                ? 'bg-olive text-paper border-olive'
                : 'bg-paper border-sand/60 text-olive-light hover:border-olive/40 hover:text-olive',
            ]"
          >
            {{ p.label }}
          </button>
        </div>

        <div class="space-y-3">
          <template v-if="filtered.length > 0">
            <TaskCard
              v-for="task in filtered"
              :key="task.id"
              :task="task"
              @toggle="toggleTask"
              @delete="deleteTask"
            />
          </template>
          <div v-else class="text-center py-16 text-olive-light/60">
            <ListTodo class="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p class="text-base font-medium text-olive-light">Cap tasca trobada</p>
            <p class="text-sm mt-1 text-olive-light/60">Afegeix una tasca nova o canvia els filtres</p>
          </div>
        </div>
      </div>

      <div v-if="showChat" class="w-80 flex-shrink-0 h-[calc(100vh-9rem)] sticky top-6">
        <ChatPanel :tasks="tasks" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { CheckSquare, Bot, BotOff, ListTodo } from 'lucide-vue-next'

const { tasks, loadFromStorage, toggleTask, deleteTask } = useTasks()

const showChat = ref(false)
const filterStatus = ref<'all' | 'active' | 'completed'>('all')
const filterPriority = ref<'all' | 'high' | 'medium' | 'low'>('all')


const themes = [
  { id: 'earthy', label: 'Verd', color: '#6F7356' },
  { id: 'rose',   label: 'Rosa', color: '#70343B' },
]

const theme = ref(import.meta.client ? (localStorage.getItem('theme') ?? 'earthy') : 'earthy')

const setTheme = (id: string) => {
  theme.value = id
  localStorage.setItem('theme', id)
  document.documentElement.setAttribute('data-theme', id === 'rose' ? 'rose' : '')
}

onMounted(() => {
  loadFromStorage()
  setTheme(theme.value)
})

const statusOptions = [
  { label: 'Totes', value: 'all' },
  { label: 'Actives', value: 'active' },
  { label: 'Completades', value: 'completed' },
]

const priorityOptions = [
  { label: 'Totes', value: 'all' },
  { label: 'Alta', value: 'high' },
  { label: 'Mitjana', value: 'medium' },
  { label: 'Baixa', value: 'low' },
]

const filtered = computed(() =>
  tasks.value.filter((t) => {
    const statusOk = filterStatus.value === 'all' || t.status === filterStatus.value
    const priorityOk = filterPriority.value === 'all' || t.priority === filterPriority.value
    return statusOk && priorityOk
  })
)
</script>

<style scoped>
.icon-enter-active,
.icon-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.icon-enter-from {
  opacity: 0;
  transform: scale(0.6) rotate(-15deg);
}
.icon-leave-to {
  opacity: 0;
  transform: scale(0.6) rotate(15deg);
}
</style>
