## Why

TaskFlow neix de la necessitat de tenir una eina lleugera de gestió de tasques personals que incorpori un assistent d'IA contextual, sense requerir registre ni backend propi. L'enfocament PWA permet instal·lar-la com una app nativa en qualsevol dispositiu.

## What Changes

- Introducció d'una PWA completa de gestió de tasques amb persistència local
- Integració d'un assistent IA (Llama 3.1 via Groq) amb accés al context de tasques actives
- Interfície amb selector de temes de color (earthy / rosa) persistent
- Endpoint serverless `/api/chat` que protegeix la clau d'API al servidor
- Disseny responsive amb paleta de colors personalitzada i icones Lucide

## Capabilities

### New Capabilities

- `task-management`: Crear, completar, eliminar i filtrar tasques amb persistència a localStorage
- `ai-assistant`: Panell de xat integrat amb Llama 3.1 via Groq API amb context de tasques actives
- `theme-switcher`: Selector de temes de color via CSS custom properties
- `pwa-support`: Instal·lació com a app nativa via manifest i service worker

### Modified Capabilities

## Impact

- **Frontend**: `app/app.vue`, `app/components/`, `app/composables/useTasks.ts`
- **Backend**: `server/api/chat.post.ts` (Nitro serverless)
- **Configuració**: `nuxt.config.ts`, `app/assets/css/main.css`
- **Dependències noves**: `groq-sdk`, `lucide-vue-next`, `@vite-pwa/nuxt`, `nanoid`
- **Variables d'entorn**: `GROQ_API_KEY` (mai exposada al client)
