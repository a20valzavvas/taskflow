<template>
  <div class="min-h-screen bg-slate-900 text-white">
    <header class="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center text-sm font-bold">T</div>
        <span class="font-bold text-lg tracking-tight">TaskFlow</span>
      </div>
      <button
        @click="showChat = !showChat"
        :class="[
          'flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-colors',
          showChat
            ? 'bg-indigo-600 border-indigo-500 text-white'
            : 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-500',
        ]"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Assistent IA
      </button>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-6 flex gap-6">
      <div :class="['flex-1 space-y-5 min-w-0', showChat ? 'max-w-xl' : '']">
        <TaskForm />

        <div class="flex gap-2 flex-wrap">
          <button
            v-for="s in statusOptions"
            :key="s.value"
            @click="filterStatus = s.value"
            :class="[
              'text-xs px-3 py-1.5 rounded-full border transition-colors',
              filterStatus === s.value
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'border-slate-700 text-slate-400 hover:border-slate-500',
            ]"
          >
            {{ s.label }}
          </button>
          <span class="w-px bg-slate-700 mx-1"></span>
          <button
            v-for="p in priorityOptions"
            :key="p.value"
            @click="filterPriority = p.value"
            :class="[
              'text-xs px-3 py-1.5 rounded-full border transition-colors',
              filterPriority === p.value
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'border-slate-700 text-slate-400 hover:border-slate-500',
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
          <div v-else class="text-center py-12 text-slate-500">
            <p class="text-lg">Cap tasca trobada</p>
            <p class="text-sm mt-1">Afegeix una tasca nova o canvia els filtres</p>
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
const { tasks, loadFromStorage, toggleTask, deleteTask } = useTasks();

const showChat = ref(false);
const filterStatus = ref<"all" | "active" | "completed">("all");
const filterPriority = ref<"all" | "high" | "medium" | "low">("all");

const statusOptions = [
  { label: "Totes", value: "all" },
  { label: "Actives", value: "active" },
  { label: "Completades", value: "completed" },
];

const priorityOptions = [
  { label: "Totes", value: "all" },
  { label: "Alta", value: "high" },
  { label: "Mitjana", value: "medium" },
  { label: "Baixa", value: "low" },
];

const filtered = computed(() =>
  tasks.value.filter((t) => {
    const statusOk = filterStatus.value === "all" || t.status === filterStatus.value;
    const priorityOk = filterPriority.value === "all" || t.priority === filterPriority.value;
    return statusOk && priorityOk;
  })
);

onMounted(loadFromStorage);
</script>
