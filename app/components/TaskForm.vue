<template>
  <form
    @submit.prevent="submit"
    class="bg-slate-800 rounded-xl p-5 border border-slate-700 space-y-4"
  >
    <h2 class="text-lg font-semibold text-white">Nova tasca</h2>

    <div>
      <input
        v-model="form.title"
        type="text"
        placeholder="Títol de la tasca *"
        required
        class="w-full bg-slate-900 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 border border-slate-600 focus:outline-none focus:border-indigo-500"
      />
    </div>

    <div>
      <textarea
        v-model="form.description"
        placeholder="Descripció (opcional)"
        rows="2"
        class="w-full bg-slate-900 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 border border-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
      />
    </div>

    <div class="flex gap-3">
      <select
        v-model="form.priority"
        class="flex-1 bg-slate-900 text-white rounded-lg px-4 py-2.5 border border-slate-600 focus:outline-none focus:border-indigo-500"
      >
        <option value="high">Alta prioritat</option>
        <option value="medium">Prioritat mitjana</option>
        <option value="low">Baixa prioritat</option>
      </select>

      <input
        v-model="form.dueDate"
        type="date"
        class="flex-1 bg-slate-900 text-white rounded-lg px-4 py-2.5 border border-slate-600 focus:outline-none focus:border-indigo-500"
      />
    </div>

    <button
      type="submit"
      class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg py-2.5 transition-colors"
    >
      Afegir tasca
    </button>
  </form>
</template>

<script setup lang="ts">
const { addTask } = useTasks();

const form = reactive({
  title: "",
  description: "",
  priority: "medium" as "high" | "medium" | "low",
  dueDate: null as string | null,
});

const submit = () => {
  addTask({
    title: form.title,
    description: form.description,
    priority: form.priority,
    dueDate: form.dueDate || null,
  });
  form.title = "";
  form.description = "";
  form.priority = "medium";
  form.dueDate = null;
};
</script>
