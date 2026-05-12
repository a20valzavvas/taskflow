<template>
  <div class="flex flex-col h-full bg-paper rounded-2xl border border-sand/50 shadow-sm">
    <div class="flex items-center gap-2 px-4 py-3 border-b border-sand/40">
      <div class="w-7 h-7 bg-olive/15 rounded-lg flex items-center justify-center">
        <Bot class="w-4 h-4 text-olive" />
      </div>
      <span class="font-semibold text-olive-dark text-sm">Assistent IA</span>
      <span class="text-xs text-sand ml-auto">Llama 3.1 · Groq</span>
    </div>

    <div ref="messagesEl" class="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
      <div
        v-if="messages.length === 0"
        class="flex flex-col items-center justify-center h-full gap-3 text-olive-light/50"
      >
        <Sparkles class="w-8 h-8 opacity-40" />
        <p class="text-sm text-center leading-relaxed px-2">Pregunta'm sobre les teves tasques o demana ajuda per organitzar-te.</p>
      </div>

      <div
        v-for="(msg, i) in messages"
        :key="i"
        :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']"
      >
        <div
          :class="[
            'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
            msg.role === 'user'
              ? 'bg-olive text-paper rounded-br-sm shadow-sm shadow-olive/20'
              : 'bg-lavender/60 text-olive-dark border border-sand/30 rounded-bl-sm',
          ]"
        >
          {{ msg.content }}
        </div>
      </div>

      <div v-if="loading" class="flex justify-start">
        <div class="bg-lavender/60 border border-sand/30 rounded-2xl rounded-bl-sm px-4 py-3">
          <div class="flex gap-1.5 items-center">
            <span class="w-1.5 h-1.5 bg-brown/50 rounded-full animate-bounce" style="animation-delay:0ms"></span>
            <span class="w-1.5 h-1.5 bg-brown/50 rounded-full animate-bounce" style="animation-delay:150ms"></span>
            <span class="w-1.5 h-1.5 bg-brown/50 rounded-full animate-bounce" style="animation-delay:300ms"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="p-3 border-t border-sand/40">
      <form @submit.prevent="send" class="flex gap-2">
        <input
          v-model="input"
          :disabled="loading"
          type="text"
          placeholder="Escriu un missatge..."
          class="flex-1 bg-cream text-olive-dark placeholder-sand rounded-xl px-3.5 py-2 text-sm border border-sand/50 focus:outline-none focus:border-olive disabled:opacity-50 transition-colors"
        />
        <button
          type="submit"
          :disabled="loading || !input.trim()"
          class="bg-olive hover:bg-olive-dark disabled:opacity-40 text-paper rounded-xl px-3 py-2 transition-colors shadow-sm shadow-olive/20"
        >
          <Send class="w-4 h-4" />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bot, Sparkles, Send } from 'lucide-vue-next'
import type { Task } from '~/composables/useTasks'

const props = defineProps<{ tasks: Task[] }>()

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const messages = ref<ChatMessage[]>([])
const input = ref('')
const loading = ref(false)
const messagesEl = ref<HTMLElement>()

const scrollToBottom = async () => {
  await nextTick()
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}

const send = async () => {
  const text = input.value.trim()
  if (!text || loading.value) return

  messages.value.push({ role: 'user', content: text })
  input.value = ''
  loading.value = true
  await scrollToBottom()

  try {
    const res = await $fetch<{ reply: string }>('/api/chat', {
      method: 'POST',
      body: {
        message: text,
        history: messages.value.slice(0, -1),
        tasks: props.tasks,
      },
    })
    messages.value.push({ role: 'assistant', content: res.reply })
  } catch {
    messages.value.push({
      role: 'assistant',
      content: 'Ho sento, hi ha hagut un error. Torna-ho a intentar.',
    })
  } finally {
    loading.value = false
    await scrollToBottom()
  }
}
</script>
