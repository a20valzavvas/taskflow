# SPEC.md — TaskFlow: Gestor de Tasques amb Assistent IA

> Document generat iterativament amb l'ajuda de Claude Code com a part del procés SDD.

---

## 1. Descripció Funcional

**TaskFlow** és una Progressive Web App (PWA) que permet als usuaris gestionar les seves tasques diàries i consultar un assistent d'intel·ligència artificial per millorar la seva productivitat.

L'usuari pot crear, completar i eliminar tasques, filtrar-les per prioritat i estat, i obrir un xat integrat on l'assistent Claude analitza les tasques actuals i respon preguntes sobre com organitzar-se millor.

### Funcionalitats principals

| # | Funcionalitat | Descripció |
|---|---|---|
| F1 | Crear tasca | L'usuari introdueix títol, descripció opcional, prioritat i data límit opcional |
| F2 | Llistar tasques | Visualització en targetes amb filtre per estat i prioritat |
| F3 | Completar tasca | Marcar/desmarcar una tasca com a feta |
| F4 | Eliminar tasca | Eliminar una tasca de la llista |
| F5 | Persistència local | Les tasques es guarden a localStorage |
| F6 | Xat assistent | Panell lateral amb xat connectat a Groq API |
| F7 | Context de tasques | L'assistent rep automàticament la llista de tasques actives |
| F8 | PWA instal·lable | L'app es pot instal·lar al dispositiu com una app nativa |

---

## 2. Actors del Sistema

| Actor | Rol |
|---|---|
| **Usuari** | Persona que gestiona les seves tasques i interacciona amb el xat |
| **Llama 3.1 (Groq API)** | Model d'IA que actua com a assistent de productivitat |
| **Servidor Nitro (Nuxt)** | Capa serverless que gestiona la comunicació amb l'API de Groq de forma segura |

---

## 3. User Journey

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
                |-- [Escriu un missatge]
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

---

## 4. Estructura de Dades

### Task

```typescript
interface Task {
  id: string           // nanoid() — identificador únic
  title: string        // requerit
  description: string  // opcional, pot ser buit
  priority: 'high' | 'medium' | 'low'
  status: 'active' | 'completed'
  dueDate: string | null  // ISO date string o null
  createdAt: string    // ISO date string
}
```

### ChatMessage

```typescript
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string    // ISO date string
}
```

### Request body — POST /api/chat

```typescript
interface ChatRequest {
  message: string
  history: Array<{ role: 'user' | 'assistant'; content: string }>
  tasks: Task[]        // llista de tasques actives per contextualitzar l'assistent
}
```

### Response — POST /api/chat

```typescript
interface ChatResponse {
  reply: string
}
```

---

## 5. Endpoints Serverless

### POST `/api/chat`

| Camp | Valor |
|---|---|
| Mètode | POST |
| Autenticació | Cap (API key guardada en variable d'entorn server-side) |
| Cos de la petició | `ChatRequest` |
| Resposta | `ChatResponse` |
| Error | `{ error: string }` amb status 500 |

**Lògica interna:**
1. Llegeix `GROQ_API_KEY` de les variables d'entorn (mai exposada al client)
2. Construeix el system prompt amb el context de tasques actives de l'usuari
3. Envia el historial de conversa + el nou missatge a `llama-3.1-8b-instant`
4. Retorna la resposta de text al client

**System prompt:**
```
Ets un assistent de productivitat personal. Ajudes l'usuari a gestionar les seves tasques.
Tens accés a la llista de tasques actives de l'usuari. Pots suggerir prioritats, 
recordar dates límit, ajudar a planificar el dia i respondre preguntes sobre productivitat.
Respon sempre en el mateix idioma que l'usuari.

Tasques actives de l'usuari:
{tasks_json}
```

---

## 6. Comportament del Chatbot

| Entrada usuari | Comportament esperat |
|---|---|
| "Quines tasques tinc per avui?" | Llista les tasques amb data límit = avui |
| "Quina tasca hauria de fer primer?" | Suggereix la tasca de major prioritat amb raonament |
| "Ajuda'm a planificar el matí" | Proposa un ordre per les tasques actives |
| Pregunta general de productivitat | Respon amb consells pràctics |
| Text en castellà | Respon en castellà |
| Text en català | Respon en català |

L'assistent **no pot** crear ni eliminar tasques directament (l'usuari ho ha de fer manualment). Sí que pot suggerir quines crear o eliminar.

---

## 7. Arquitectura Tècnica

```
┌─────────────────────────────────────────┐
│              CLIENT (Nuxt.js)           │
│                                         │
│  ┌──────────┐  ┌──────────────────────┐ │
│  │ TaskList │  │    ChatPanel         │ │
│  │ TaskForm │  │  (panell lateral)    │ │
│  │ TaskCard │  │                      │ │
│  └──────────┘  └──────────────────────┘ │
│        │              │                 │
│        └──── useTasks (composable) ─────┘
│                    │                    │
│               localStorage             │
└────────────────────┼────────────────────┘
                     │ POST /api/chat
                     ▼
┌─────────────────────────────────────────┐
│         SERVER (Nitro / Serverless)     │
│                                         │
│   server/api/chat.post.ts               │
│         │                               │
│         ▼                               │
│   Groq SDK → Llama 3.1 8B Instant            │
└─────────────────────────────────────────┘
```

### Stack

| Capa | Tecnologia |
|---|---|
| Frontend | Nuxt 3 (Vue 3 + Composition API) |
| Estils | Tailwind CSS |
| Serverless | Nitro (Nuxt server routes) |
| IA | Groq SDK (`groq-sdk`) |
| PWA | `@vite-pwa/nuxt` |
| Persistència client | localStorage (via composable `useTasks`) |
| Identificadors | `nanoid` |

---

## 8. Variables d'Entorn

| Variable | Descripció | Exemple |
|---|---|---|
| `GROQ_API_KEY` | Clau secreta de l'API de Groq | `gsk_...` |

Guardar en fitxer `.env` (no pujar mai a Git).
