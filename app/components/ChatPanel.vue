<template>
  <div class="flex flex-col h-full bg-slate-800 rounded-xl border border-slate-700">
    <div class="flex items-center gap-2 px-4 py-3 border-b border-slate-700">
      <div class="w-2 h-2 rounded-full bg-indigo-400"></div>
      <span class="font-semibold text-white text-sm">Assistent IA</span>
      <span class="text-xs text-slate-400 ml-auto">Claude claude-sonnet-4-6</span>
    </div>

    <div ref="messagesEl" class="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
      <div
        v-if="messages.length === 0"
        class="text-slate-500 text-sm text-center mt-8"
      >
        Pregunta'm sobre les teves tasques o demana ajuda per organitzar-te.
      </div>

      <div
        v-for="(msg, i) in messages"
        :key="i"
        :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']"
      >
        <div
          :class="[
            'max-w-[85%] rounded-xl px-3 py-2 text-sm',
            msg.role === 'user'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-700 text-slate-200',
          ]"
        >
          {{ msg.content }}
        </div>
      </div>

      <div v-if="loading" class="flex justify-start">
        <div class="bg-slate-700 rounded-xl px-3 py-2">
          <div class="flex gap-1">
            <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay:0ms"></span>
            <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay:150ms"></span>
            <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay:300ms"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="p-3 border-t border-slate-700">
      <form @submit.prevent="send" class="flex gap-2">
        <input
          v-model="input"
          :disabled="loading"
          type="text"
          placeholder="Escriu un missatge..."
          class="flex-1 bg-slate-900 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm border border-slate-600 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
        />
        <button
          type="submit"
          :disabled="loading || !input.trim()"
          class="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg px-3 py-2 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from "~/composables/useTasks";

const props = defineProps<{ tasks: Task[] }>();

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const messages = ref<ChatMessage[]>([]);
const input = ref("");
const loading = ref(false);
const messagesEl = ref<HTMLElement>();

const scrollToBottom = async () => {
  await nextTick();
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
  }
};

const send = async () => {
  const text = input.value.trim();
  if (!text || loading.value) return;

  messages.value.push({ role: "user", content: text });
  input.value = "";
  loading.value = true;
  await scrollToBottom();

  try {
    const res = await $fetch<{ reply: string }>("/api/chat", {
      method: "POST",
      body: {
        message: text,
        history: messages.value.slice(0, -1),
        tasks: props.tasks,
      },
    });
    messages.value.push({ role: "assistant", content: res.reply });
  } catch {
    messages.value.push({
      role: "assistant",
      content: "Ho sento, hi ha hagut un error. Torna-ho a intentar.",
    });
  } finally {
    loading.value = false;
    await scrollToBottom();
  }
};
</script>
