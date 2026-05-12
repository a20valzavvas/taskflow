# Documentació Tècnica — TaskFlow

**Metodologia**: Specification-Driven Development (OpenSpec)  
**Tecnologia**: Nuxt 3 · Tailwind CSS · Groq API · PWA

---

## 1. Funcionalitats de l'aplicació

### Descripció general

**TaskFlow** és una Progressive Web App (PWA) per gestionar tasques diàries amb un assistent d'intel·ligència artificial integrat. L'aplicació permet organitzar el treball personal, filtrar tasques per prioritat i estat, i consultar un assistent IA que coneix les tasques actives de l'usuari i pot ajudar a planificar el dia.

L'app és instal·lable com a aplicació nativa en qualsevol dispositiu i funciona completament al navegador, sense necessitat de compte ni registre.

### Funcionalitats principals

| #   | Funcionalitat          | Descripció                                                                                     |
| --- | ---------------------- | ---------------------------------------------------------------------------------------------- |
| F1  | **Crear tasca**        | Formulari amb títol, descripció opcional, prioritat (alta/mitjana/baixa) i data límit opcional |
| F2  | **Llistar tasques**    | Vista de targetes amb tota la informació de cada tasca                                         |
| F3  | **Filtrar tasques**    | Filtres combinables per estat (actives/completades) i per prioritat                            |
| F4  | **Completar tasca**    | Marcar i desmarcar tasques com a fetes amb un clic                                             |
| F5  | **Eliminar tasca**     | Eliminar una tasca permanentment de la llista                                                  |
| F6  | **Persistència local** | Les tasques es guarden a localStorage i es restauren en recarregar                             |
| F7  | **Assistent IA**       | Panell lateral de xat connectat a Llama 3.1 via Groq API                                       |
| F8  | **Context de tasques** | L'assistent rep automàticament la llista de tasques actives                                    |
| F9  | **Selector de temes**  | Canvi de paleta de colors (verd / rosa) persistent entre sessions                              |
| F10 | **PWA instal·lable**   | L'app es pot instal·lar al dispositiu com una app nativa                                       |

### Casos d'ús principals

**Cas 1 — Gestió diària de tasques**  
L'usuari obre l'app, crea les tasques del dia amb les seves prioritats i dates límit, i les va completant al llarg de la jornada. Les tasques completades queden visibles però esmorteïdes.

**Cas 2 — Planificació amb l'assistent**  
L'usuari té diverses tasques actives i no sap per on començar. Obre el panell de xat i pregunta: _"Ajuda'm a planificar el matí"_. L'assistent analitza les tasques actives (prioritats i dates límit) i proposa un ordre raonable.

**Cas 3 — Revisió per prioritat**  
L'usuari filtra les tasques per prioritat alta per veure únicament les més urgents, o combina el filtre amb l'estat "actives" per veure només les pendents d'alta prioritat.

---

## 2. Captures de l'aplicació

> **Nota**: Afegir captures de pantalla de l'aplicació en funcionament.

### 2.1 Vista principal — Llista de tasques

`[CAPTURA: Vista principal amb diverses tasques creades, filtres visibles]`

### 2.2 Formulari de creació de tasca

`[CAPTURA: Formulari amb camps de títol, descripció, prioritat i data límit]`

### 2.3 Panell de l'assistent IA

`[CAPTURA: Panell lateral obert amb una conversa amb l'assistent]`

### 2.4 Selector de temes

`[CAPTURA: Comparativa dels dos temes de color (verd i rosa)]`

### 2.5 Vista mòbil / PWA instal·lada

`[CAPTURA: App en dispositiu mòbil o instal·lada com a PWA]`

---

## 3. Procés d'especificació — OpenSpec

### Metodologia

Aquest projecte aplica la metodologia **OpenSpec**, un enfocament de Specification-Driven Development (SDD) on la implementació es deriva d'un document d'especificació central (`SPEC.md`) que actua com a font de veritat del sistema. L'especificació es construeix iterativament amb l'ajuda d'un agent d'IA abans de generar cap línia de codi.

Les tres fases principals de l'OpenSpec aplicades al projecte:

---

### a. Foundations — Context, objectius i abast

**Context del projecte**

La pràctica proposa construir una PWA amb stack modern (Nuxt.js + serverless) incorporant un assistent d'IA com a funcionalitat obligatòria. L'enfocament metodològic és el Specification-Driven Development: primer especificar, després implementar.

**Problema que resol**

Les eines de gestió de tasques existents són sovint complexes o requereixen registre. TaskFlow proposa una alternativa lleugera, instal·lable i amb IA integrada que funciona directament al navegador sense backend propi.

**Objectius**

| Prioritat | Objectiu                                                         |
| --------- | ---------------------------------------------------------------- |
| Alta      | Gestió completa de tasques (crear, completar, eliminar, filtrar) |
| Alta      | Assistent IA que coneix el context de l'usuari                   |
| Alta      | PWA instal·lable al dispositiu                                   |
| Mitjana   | Persistència de dades sense necessitat de compte                 |
| Baixa     | Personalització visual (selector de temes)                       |

**Abast**

_Dins de l'abast:_

- Gestió de tasques locals (un sol usuari per dispositiu)
- Integració d'assistent IA via API externa
- Disseny responsive i instal·lació com a PWA

_Fora de l'abast:_

- Autenticació d'usuaris
- Sincronització entre dispositius
- L'assistent no pot crear ni eliminar tasques directament

**Actors del sistema**

| Actor                     | Rol                                                                  |
| ------------------------- | -------------------------------------------------------------------- |
| **Usuari**                | Gestiona les seves tasques i interactua amb el xat                   |
| **Llama 3.1 (Groq API)**  | Model d'IA que actua com a assistent de productivitat                |
| **Servidor Nitro (Nuxt)** | Capa serverless que gestiona la comunicació amb Groq de forma segura |

---

### b. Specify — Descripció funcional i comportament esperat

**User Journey**

```
[Usuari obre l'app]
        |
        v
[Veu la llista de tasques (buida si és primera vegada)]
        |
        |-- [Crea una tasca] --> [Formulari] --> [Tasca apareix a la llista]
        |
        |-- [Filtra tasques] --> [Selecciona estat / prioritat] --> [Llista actualitzada]
        |
        |-- [Completa tasca] --> [Targeta marcada com a feta]
        |
        |-- [Elimina tasca] --> [Tasca desapareix]
        |
        |-- [Obre el xat]
                |
                v
        [Panell lateral de xat]
                |
                v
        [POST /api/chat amb missatge + context de tasques]
                |
                v
        [Servidor Nitro → Groq API → Llama 3.1]
                |
                v
        [Resposta de l'assistent apareix al xat]
```

**Estructura de dades**

```typescript
interface Task {
  id: string; // nanoid() — identificador únic
  title: string; // requerit
  description: string; // opcional
  priority: "high" | "medium" | "low";
  status: "active" | "completed";
  dueDate: string | null; // ISO date string o null
  createdAt: string; // ISO date string
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
```

**Endpoint serverless: POST `/api/chat`**

| Camp      | Detall                                                                    |
| --------- | ------------------------------------------------------------------------- |
| Mètode    | POST                                                                      |
| Cos       | `{ message, history, tasks }`                                             |
| Resposta  | `{ reply: string }`                                                       |
| Seguretat | API key guardada en variable d'entorn server-side, mai exposada al client |

Lògica interna:

1. Llegeix `GROQ_API_KEY` de les variables d'entorn del servidor
2. Construeix un system prompt amb les tasques actives de l'usuari
3. Envia l'historial de conversa + el nou missatge a `llama-3.1-8b-instant`
4. Retorna la resposta de text al client

**Comportament de l'assistent**

| Entrada                             | Comportament esperat                          |
| ----------------------------------- | --------------------------------------------- |
| "Quines tasques tinc per avui?"     | Llista les tasques amb data límit = avui      |
| "Quina tasca hauria de fer primer?" | Suggereix la de major prioritat amb raonament |
| "Ajuda'm a planificar el matí"      | Proposa un ordre per les tasques actives      |
| Text en castellà                    | Respon en castellà                            |
| Text en català                      | Respon en català                              |

---

### c. Planning — Organització, estructura i decisions tècniques

**Stack tecnològic**

| Capa           | Tecnologia                       | Justificació                                     |
| -------------- | -------------------------------- | ------------------------------------------------ |
| Frontend       | Nuxt 3 (Vue 3 + Composition API) | Requerit per l'enunciat                          |
| Estils         | Tailwind CSS v4                  | Utilitats CSS, integració nativa amb Vite        |
| Serverless     | Nitro (Nuxt server routes)       | Integrat a Nuxt, zero configuració addicional    |
| IA             | Groq SDK (`groq-sdk`)            | Capa gratuïta, model Llama 3.1, API compatible   |
| PWA            | `@vite-pwa/nuxt`                 | Plugin oficial per Nuxt, configuració senzilla   |
| Icones         | `lucide-vue-next`                | Lleuger, tree-shakeable, estèticament coherent   |
| Persistència   | localStorage                     | Suficient per un sol usuari, sense backend propi |
| Identificadors | `nanoid`                         | IDs únics curts per a cada tasca                 |

**Estructura del projecte**

```
taskflow/
├── app/
│   ├── app.vue                    # Layout principal, filtres i selector de temes
│   ├── assets/css/main.css        # Tailwind CSS + variables de tema (@theme)
│   ├── components/
│   │   ├── TaskForm.vue           # Formulari per crear tasques
│   │   ├── TaskCard.vue           # Targeta de tasca individual
│   │   └── ChatPanel.vue          # Panell lateral del xat IA
│   └── composables/
│       └── useTasks.ts            # Estat global i persistència de tasques
├── server/api/
│   └── chat.post.ts               # Endpoint serverless → Groq API
├── public/                        # Icones PWA i fitxers estàtics
├── SPEC.md                        # Especificació tècnica del sistema
├── PROCESS.md                     # Registre del procés de desenvolupament
└── .env                           # Variables d'entorn (no versionat)
```

**Decisions tècniques clau**

_Decisió 1 — localStorage en lloc de base de dades_  
Es va optar per persistència local per simplicitat. L'app és personal (un sol usuari per dispositiu) i no requereix sincronització. Avantatge: zero dependències de backend, funciona offline.

_Decisió 2 — API key al servidor (Nitro), mai al client_  
La clau de Groq es llegeix des de `useRuntimeConfig()` al servidor. Això garanteix que la clau no apareix mai al bundle del navegador ni és accessible des de les DevTools.

_Decisió 3 — Temes via CSS custom properties_  
El selector de temes usa variables CSS definides a `main.css` sota `@theme` (Tailwind v4). En aplicar `data-theme="rose"` a `<html>`, totes les utilitats de Tailwind que usen les variables actualitzen el valor automàticament, sense haver de canviar cap classe als components.

_Decisió 4 — Migració d'Anthropic a Groq_  
Durant el desenvolupament es va detectar que el compte d'Anthropic no tenia saldo. Es va migrar a Groq (gratuït) amb canvis mínims: el format de l'API és compatible (missatges amb `role`/`content`) i el comportament del model és equivalent per a aquest cas d'ús.

---

## 4. Annex — Fitxers rellevants

### 4.1 Extracte de SPEC.md

> Document complet disponible al repositori: `SPEC.md`

El document `SPEC.md` recull l'especificació tècnica completa del sistema, generada iterativament amb l'agent d'IA abans de començar la implementació. Conté:

- Descripció funcional i taula de funcionalitats
- Actors del sistema
- User Journey en format diagrama
- Estructures de dades TypeScript (`Task`, `ChatMessage`, `ChatRequest`)
- Definició de l'endpoint serverless amb lògica interna i system prompt
- Taula de comportament del chatbot per tipus d'entrada
- Diagrama d'arquitectura ASCII
- Stack tecnològic i variables d'entorn

### 4.2 Extracte de PROCESS.md

> Document complet disponible al repositori: `PROCESS.md`

El document `PROCESS.md` registra el procés real de desenvolupament, incloent:

- Prompts exactes usats en cada fase
- Decisions preses i justificacions
- Bugs detectats i solucions aplicades (reactivitat Vue, migració Anthropic→Groq, error SSR de localStorage)
- Reflexió final sobre la metodologia SDD i l'ús de l'agent

### 4.3 tasks.md — OpenSpec (complet)

> Generat amb `openspec new change taskflow-app` seguint el flux spec-driven.

```markdown
## 1. Configuració inicial del projecte
- [x] 1.1 Inicialitzar projecte Nuxt 3 amb TypeScript
- [x] 1.2 Configurar Tailwind CSS v4 via @tailwindcss/vite
- [x] 1.3 Afegir @vite-pwa/nuxt i configurar manifest PWA a nuxt.config.ts
- [x] 1.4 Configurar runtimeConfig per a GROQ_API_KEY
- [x] 1.5 Crear fitxer .env amb la clau d'API (no versionat)

## 2. Gestió de tasques
- [x] 2.1 Definir la interfície Task amb TypeScript
- [x] 2.2 Crear composable useTasks.ts amb useState de Nuxt
- [x] 2.3 Implementar addTask amb nanoid per a IDs únics
- [x] 2.4 Implementar toggleTask per canviar estat actiu/completat
- [x] 2.5 Implementar deleteTask per eliminar tasques
- [x] 2.6 Implementar loadFromStorage i saveToStorage amb guard import.meta.client

## 3. Components d'interfície
- [x] 3.1 Crear TaskForm.vue amb camps títol, descripció, prioritat i data límit
- [x] 3.2 Crear TaskCard.vue amb badge de prioritat, dates i botons d'acció
- [x] 3.3 Afegir icones Lucide (Flame, CheckCircle2, Trash2, Calendar, Clock)
- [x] 3.4 Implementar filtres per estat i prioritat a app.vue
- [x] 3.5 Mostrar estat buit amb icona ListTodo quan no hi ha tasques

## 4. Assistent IA
- [x] 4.1 Instal·lar groq-sdk i desinstal·lar @anthropic-ai/sdk
- [x] 4.2 Crear server/api/chat.post.ts amb lectura segura de GROQ_API_KEY
- [x] 4.3 Construir system prompt amb context de tasques actives
- [x] 4.4 Implementar crida a llama-3.1-8b-instant amb historial de conversa
- [x] 4.5 Crear ChatPanel.vue amb historial, input, loading dots i scroll automàtic
- [x] 4.6 Integrar panell de xat a app.vue com a panell lateral desplegable

## 5. Selector de temes
- [x] 5.1 Definir variables CSS a main.css amb @theme (paleta earthy)
- [x] 5.2 Afegir override de variables sota [data-theme="rose"]
- [x] 5.3 Implementar setTheme que aplica data-theme a document.documentElement
- [x] 5.4 Persistir tema seleccionat a localStorage
- [x] 5.5 Protegir lectura de localStorage amb import.meta.client
- [x] 5.6 Afegir botons de selecció de tema al header

## 6. Millores visuals i UX
- [x] 6.1 Aplicar paleta de colors personalitzada (earthy i rosa)
- [x] 6.2 Afegir transició animada a l'icona del botó Assistent IA
- [x] 6.3 Afegir lema al header ("organitza el teu dia")
- [x] 6.4 Estilitzar badges de prioritat amb icones i vores subtils
- [x] 6.5 Implementar missatges de xat amb estil bubble arrodonit

## 7. Documentació
- [x] 7.1 Crear SPEC.md amb especificació tècnica completa
- [x] 7.2 Crear PROCESS.md amb registre del procés de desenvolupament
- [x] 7.3 Crear DOC.md seguint estructura OpenSpec per al PDF de lliurament
- [x] 7.4 Inicialitzar OpenSpec al projecte (openspec init --tools claude)
- [x] 7.5 Generar artifacts OpenSpec: proposal.md, design.md, specs/, tasks.md
```

### 4.4 Variables d'entorn (`.env.example`)

```
GROQ_API_KEY=gsk_...
```

La clau s'obté gratuïtament a [console.groq.com](https://console.groq.com). Mai s'ha de pujar al repositori (inclòs a `.gitignore`).
