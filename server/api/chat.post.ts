import Groq from "groq-sdk";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const { message, history = [], tasks = [] } = body;

  if (!message) {
    throw createError({ statusCode: 400, message: "Missing message" });
  }

  const activeTasks = tasks.filter((t: { status: string }) => t.status === "active");
  const tasksContext =
    activeTasks.length > 0
      ? JSON.stringify(activeTasks, null, 2)
      : "No hi ha tasques actives.";

  const client = new Groq({ apiKey: config.groqApiKey });

  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    max_tokens: 1024,
    messages: [
      {
        role: "system",
        content: `Ets un assistent de productivitat personal per a l'app TaskFlow.
Ajudes l'usuari a gestionar les seves tasques diàries.
Tens accés a la llista de tasques actives de l'usuari.
Pots suggerir prioritats, recordar dates límit, ajudar a planificar el dia i respondre preguntes sobre productivitat.
Respon sempre en el mateix idioma que l'usuari (català o castellà).
Sigues concís i pràctic.

Tasques actives de l'usuari:
${tasksContext}`,
      },
      ...history.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: message },
    ],
  });

  const reply = response.choices[0]?.message?.content ?? "";

  return { reply };
});
