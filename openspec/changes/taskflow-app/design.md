## Context

TaskFlow és una PWA construïda amb Nuxt 3 (Vue 3 + Composition API) que usa Nitro com a capa serverless. L'assistent IA es comunica amb Groq API des del servidor, mantenint la clau d'API fora del bundle del client. Les dades de tasques es persisteixen a localStorage sense necessitat de base de dades ni autenticació.

## Goals / Non-Goals

**Goals:**
- Gestió completa de tasques (CRUD) amb persistència local entre sessions
- Assistent IA contextual que coneix les tasques actives de l'usuari
- PWA instal·lable amb manifest i service worker
- Temes de color canviables via CSS custom properties sense recarregar
- Codi segur: clau d'API només al servidor, mai al client

**Non-Goals:**
- Sincronització entre dispositius o usuaris
- Autenticació / comptes d'usuari
- L'assistent no pot modificar tasques directament
- Suport offline per al xat (requereix connexió per cridar Groq)

## Decisions

**Decisió 1 — Nitro (Nuxt server routes) com a serverless**
- Escollit per sobre d'una funció externa (Vercel/Netlify) per evitar configuració addicional
- Integrat natiu a Nuxt 3, zero overhead de desplegament
- La clau `GROQ_API_KEY` es llegeix via `useRuntimeConfig()` al servidor, mai exposada al client

**Decisió 2 — localStorage en lloc de base de dades**
- L'app és personal (un sol usuari per dispositiu), no necessita sincronització
- Elimina dependències externes i cost d'infraestructura
- Risc: les dades es perden si s'esborra el localStorage. Mitigació: acceptable per a l'abast del projecte

**Decisió 3 — Groq (Llama 3.1) en lloc d'Anthropic Claude**
- Anthropic requereix saldo de pagament; Groq ofereix una capa gratuïta
- L'API de Groq és compatible amb el format OpenAI (array de `messages` amb `role`/`content`)
- Model escollit: `llama-3.1-8b-instant` per velocitat i gratuïtat

**Decisió 4 — CSS custom properties per als temes**
- Es defineixen variables a `@theme` (Tailwind v4) i s'override sota `[data-theme="rose"]`
- Canviar `document.documentElement.setAttribute('data-theme', ...)` propaga el canvi a tota l'app automàticament
- Alternatiu descartat: classes dinàmiques per component (més verbós, menys mantenible)

**Decisió 5 — `import.meta.client` per a SSR safety**
- Nuxt 3 renderitza al servidor per defecte; `localStorage` no existeix al servidor
- Totes les lectures de `localStorage` estan protegides amb `import.meta.client`

## Risks / Trade-offs

- **[Risc] Pèrdua de dades** → L'usuari pot perdre tasques si esborra les dades del navegador. Mitigació: acceptable per a l'abast; es podria afegir exportació JSON en el futur.
- **[Risc] Límit de la capa gratuïta de Groq** → Si l'usuari fa moltes peticions, pot arribar al límit. Mitigació: per a ús personal és suficient.
- **[Trade-off] SSR + localStorage** → El tema i les tasques no es carreguen fins al client, causant un flash inicial. Mitigació: valors per defecte coherents eviten salts visuals.
- **[Risc] Canvi de proveïdor d'IA** → Si Groq canvia la seva política, cal migrar. Mitigació: la lògica d'IA està aïllada a `server/api/chat.post.ts`.

## Open Questions

- *(Resolt)* Quin model d'IA usar? → `llama-3.1-8b-instant` via Groq (gratuït, suficientment capaz)
- *(Resolt)* On persistir les dades? → localStorage (suficient per a un usuari per dispositiu)
- *(Pendent)* Afegir exportació de tasques a JSON en futures versions?
