import Anthropic from "@anthropic-ai/sdk";

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

  const client = new Anthropic({ apiKey: config.anthropicApiKey });

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: `Ets un assistent de productivitat personal per a l'app TaskFlow.
Ajudes l'usuari a gestionar les seves tasques diàries.
Tens accés a la llista de tasques actives de l'usuari.
Pots suggerir prioritats, recordar dates límit, ajudar a planificar el dia i respondre preguntes sobre productivitat.
Respon sempre en el mateix idioma que l'usuari (català o castellà).
Sigues concís i pràctic.

Tasques actives de l'usuari:
${tasksContext}`,
    messages: [
      ...history.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: message },
    ],
  });

  const reply =
    response.content[0].type === "text" ? response.content[0].text : "";

  return { reply };
});
