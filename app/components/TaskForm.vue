<template>
  <form
    @submit.prevent="submit"
    class="bg-paper rounded-2xl p-5 border border-sand/40 space-y-4 shadow-sm"
  >
    <h2 class="text-base font-semibold text-olive-dark flex items-center gap-2">
      <Plus class="w-4 h-4 text-olive" />
      Nova tasca
    </h2>

    <div class="relative">
      <Tag class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand pointer-events-none" />
      <input
        v-model="form.title"
        type="text"
        placeholder="Títol de la tasca *"
        required
        class="w-full bg-cream text-olive-dark placeholder-sand rounded-xl pl-10 pr-4 py-2.5 border border-sand/50 focus:outline-none focus:border-olive transition-colors text-sm"
      />
    </div>

    <div class="relative">
      <AlignLeft class="absolute left-3 top-3 w-4 h-4 text-sand pointer-events-none" />
      <textarea
        v-model="form.description"
        placeholder="Descripció (opcional)"
        rows="2"
        class="w-full bg-cream text-olive-dark placeholder-sand rounded-xl pl-10 pr-4 py-2.5 border border-sand/50 focus:outline-none focus:border-olive resize-none transition-colors text-sm"
      />
    </div>

    <div class="flex gap-3">
      <div class="relative flex-1">
        <Flame class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand pointer-events-none" />
        <select
          v-model="form.priority"
          class="w-full bg-cream text-olive-dark rounded-xl pl-10 pr-4 py-2.5 border border-sand/50 focus:outline-none focus:border-olive transition-colors appearance-none text-sm"
        >
          <option value="high">Alta prioritat</option>
          <option value="medium">Prioritat mitjana</option>
          <option value="low">Baixa prioritat</option>
        </select>
      </div>

      <div class="relative flex-1">
        <Calendar class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand pointer-events-none" />
        <input
          v-model="form.dueDate"
          type="date"
          class="w-full bg-cream text-olive-dark rounded-xl pl-10 pr-4 py-2.5 border border-sand/50 focus:outline-none focus:border-olive transition-colors text-sm"
        />
      </div>
    </div>

    <button
      type="submit"
      class="w-full bg-olive hover:bg-olive-dark text-paper font-medium rounded-xl py-2.5 transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-olive/20"
    >
      <Plus class="w-4 h-4" />
      Afegir tasca
    </button>
  </form>
</template>

<script setup lang="ts">
import { Plus, Tag, AlignLeft, Flame, Calendar } from 'lucide-vue-next'

const { addTask } = useTasks()

const form = reactive({
  title: '',
  description: '',
  priority: 'medium' as 'high' | 'medium' | 'low',
  dueDate: null as string | null,
})

const submit = () => {
  addTask({
    title: form.title,
    description: form.description,
    priority: form.priority,
    dueDate: form.dueDate || null,
  })
  form.title = ''
  form.description = ''
  form.priority = 'medium'
  form.dueDate = null
}
</script>
