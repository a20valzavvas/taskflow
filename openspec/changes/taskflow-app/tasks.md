## 1. Configuració inicial del projecte

- [x] 1.1 Inicialitzar projecte Nuxt 3 amb TypeScript
- [x] 1.2 Configurar Tailwind CSS v4 via `@tailwindcss/vite`
- [x] 1.3 Afegir `@vite-pwa/nuxt` i configurar manifest PWA a `nuxt.config.ts`
- [x] 1.4 Configurar `runtimeConfig` per a `GROQ_API_KEY`
- [x] 1.5 Crear fitxer `.env` amb la clau d'API (no versionat)

## 2. Gestió de tasques

- [x] 2.1 Definir la interfície `Task` amb TypeScript
- [x] 2.2 Crear composable `useTasks.ts` amb `useState` de Nuxt
- [x] 2.3 Implementar `addTask` amb `nanoid` per a IDs únics
- [x] 2.4 Implementar `toggleTask` per canviar estat actiu/completat
- [x] 2.5 Implementar `deleteTask` per eliminar tasques
- [x] 2.6 Implementar `loadFromStorage` i `saveToStorage` amb guard `import.meta.client`

## 3. Components d'interfície

- [x] 3.1 Crear `TaskForm.vue` amb camps títol, descripció, prioritat i data límit
- [x] 3.2 Crear `TaskCard.vue` amb badge de prioritat, dates i botons d'acció
- [x] 3.3 Afegir icones Lucide (`Flame`, `CheckCircle2`, `Trash2`, `Calendar`, `Clock`)
- [x] 3.4 Implementar filtres per estat i prioritat a `app.vue`
- [x] 3.5 Mostrar estat buit amb icona `ListTodo` quan no hi ha tasques

## 4. Assistent IA

- [x] 4.1 Instal·lar `groq-sdk` i desinstal·lar `@anthropic-ai/sdk`
- [x] 4.2 Crear `server/api/chat.post.ts` amb lectura segura de `GROQ_API_KEY`
- [x] 4.3 Construir system prompt amb context de tasques actives
- [x] 4.4 Implementar crida a `llama-3.1-8b-instant` amb historial de conversa
- [x] 4.5 Crear `ChatPanel.vue` amb historial, input, loading dots i scroll automàtic
- [x] 4.6 Integrar panell de xat a `app.vue` com a panell lateral desplegable

## 5. Selector de temes

- [x] 5.1 Definir variables CSS a `main.css` amb `@theme` (paleta earthy)
- [x] 5.2 Afegir override de variables sota `[data-theme="rose"]`
- [x] 5.3 Implementar `setTheme` que aplica `data-theme` a `document.documentElement`
- [x] 5.4 Persistir tema seleccionat a localStorage
- [x] 5.5 Protegir lectura de localStorage amb `import.meta.client`
- [x] 5.6 Afegir botons de selecció de tema al header

## 6. Millores visuals i UX

- [x] 6.1 Aplicar paleta de colors personalitzada (earthy: `#6F7356`, `#D9BB96`, etc.)
- [x] 6.2 Afegir transició animada a l'icona del botó "Assistent IA" (`BotOff` → `Bot`)
- [x] 6.3 Afegir lema al header ("organitza el teu dia")
- [x] 6.4 Estilitzar badges de prioritat amb icones i vores subtils
- [x] 6.5 Implementar missatges de xat amb estil bubble arrodonit

## 7. Documentació

- [x] 7.1 Crear `SPEC.md` amb especificació tècnica completa
- [x] 7.2 Crear `PROCESS.md` amb registre del procés de desenvolupament
- [x] 7.3 Crear `DOC.md` seguint estructura OpenSpec per al PDF de lliurament
- [x] 7.4 Inicialitzar OpenSpec al projecte (`openspec init --tools claude`)
- [x] 7.5 Generar artifacts OpenSpec: `proposal.md`, `design.md`, `specs/`, `tasks.md`
