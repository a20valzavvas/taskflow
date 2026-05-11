# PROCESS.md — Registre del Procés de Desenvolupament amb IA

## Resum del procés

Aquest projecte s'ha desenvolupat seguint la metodologia **Specification-Driven Development (SDD)** utilitzant **Claude Code** (Claude claude-sonnet-4-6) com a agent principal de desenvolupament.

---

## Fase 1 — Definició de l'arquitectura amb IA

### Prompt inicial

> "Necessito construir una PWA amb Nuxt.js que permeti gestionar tasques i tingui un chatbot integrat amb Claude API. Proposa'm una arquitectura tècnica."

### Resposta de l'agent (resum)

L'agent va proposar:
- **Frontend**: Nuxt 3 amb Vue 3 Composition API + Tailwind CSS
- **Serverless**: Nitro server routes per protegir la API Key d'Anthropic
- **Persistència**: localStorage al client (sense base de dades)
- **PWA**: `@vite-pwa/nuxt` per fer l'app instal·lable
- **Chatbot**: Ruta `/api/chat` que rep el missatge + context de tasques i retorna la resposta de Claude

### Decisió presa

S'ha acceptat l'arquitectura proposada amb una modificació: en lloc d'usar una base de dades externa, s'ha optat per localStorage per simplicitat, donada la naturalesa personal de l'app (un sol usuari, sense necessitat de sincronització).

---

## Fase 2 — Creació de l'especificació (SPEC.md)

### Prompt utilitzat

> "Crea un document SPEC.md complet per a l'app TaskFlow. Ha d'incloure: descripció funcional, actors, user journey, estructura de dades, endpoints serverless i comportament del chatbot."

### Iteració

Primera versió generada per l'agent. Es van fer les correccions manuals següents:
- Afegir la taula de comportament del chatbot per idioma
- Aclarir que l'assistent no pot crear tasques directament (limitació intencional)
- Afegir el diagrama d'arquitectura en ASCII

---

## Fase 3 — Implementació pas a pas

### 3.1 Configuració del projecte

```
Prompt: "Inicialitza un projecte Nuxt 3 amb TypeScript, Tailwind CSS i @vite-pwa/nuxt. Configura nuxt.config.ts amb la runtimeConfig per a la clau d'Anthropic."
```

**Resultat**: L'agent va generar la configuració de `nuxt.config.ts` i la integració de Tailwind usant `@tailwindcss/vite`.

### 3.2 Composable useTasks

```
Prompt: "Crea un composable useTasks.ts que gestioni l'estat de les tasques amb useState de Nuxt, i persisteixi a localStorage. Ha d'incloure addTask, toggleTask, deleteTask i loadFromStorage."
```

**Revisió crítica**: Es va verificar que `import.meta.client` s'usa correctament per evitar errors de SSR (el localStorage no existeix al servidor).

### 3.3 Components Vue

```
Prompt: "Crea els components TaskForm.vue, TaskCard.vue amb Tailwind. Disseny fosc (slate-800/slate-900). TaskCard ha de mostrar prioritat amb colors (vermell/ambre/verd) i permetre completar i eliminar."
```

**Bug detectat i solucionat**: En la primera versió, `TaskCard` usava `props.task` directament en el template sense `computed`, causant warnings de reactivitat. Es va corregir envoltant les propietats derivades en `computed()`.

### 3.4 Ruta serverless /api/chat

```
Prompt: "Crea server/api/chat.post.ts que llegeixi ANTHROPIC_API_KEY de runtimeConfig, construeixi un system prompt amb el context de tasques actives de l'usuari, i cridi l'SDK d'Anthropic amb el model claude-sonnet-4-6."
```

**Revisió**: Es va comprovar que la clau mai s'exposa al client (s'usa `useRuntimeConfig()` al servidor, no `useRuntimeConfig().public`).

### 3.5 Panell de xat

```
Prompt: "Crea ChatPanel.vue amb historial de missatges, input de text, indicador de càrrega (bouncing dots) i scroll automàtic. Ha de cridar POST /api/chat amb el missatge, l'historial i la llista de tasques actives."
```

---

## Fase 4 — Integració i proves

### Prova del chatbot

**Missatge enviat**: "Quines tasques tinc pendents d'alta prioritat?"

**Resposta de Claude**: L'assistent va llistar correctament les tasques actives filtrades per prioritat alta, demostrant que el context s'envia correctament.

**Missatge enviat**: "Ajuda'm a planificar el matí"

**Resposta de Claude**: Va proposar un ordre raonable basat en les dates límit i prioritats.

### Prova de persistència

Es van afegir 3 tasques, es va recarregar la pàgina i les tasques es van restaurar correctament des de localStorage.

---

## Fase 5 — Reflexió final

### Què ha funcionat bé

- L'especificació prèvia (SPEC.md) va permetre que l'agent generés codi coherent des del primer moment.
- Separar la ruta `/api/chat` al servidor va ser una decisió correcta: la clau d'API mai queda exposada al navegador.
- El disseny fosc amb Tailwind va resultar net sense necessitat de moltes iteracions.

### Què ha requerit revisió manual

- La primera versió de `nuxt.config.ts` no incloïa la configuració PWA correctament.
- El composable `useTasks` requeria guardar `import.meta.client` per evitar errors SSR.
- Els tipus TypeScript del chatbot necessitaven ajustos explícits per satisfer l'SDK d'Anthropic.

### Aprenentatges

- Una bona especificació redueix dràsticament el nombre d'iteracions necessàries.
- L'agent és molt eficaç per generar codi boilerplate i components, però cal revisar els detalls de seguretat (exposició de claus, SSR/client boundaries).
- Actuar com a *tech lead* significa entendre el codi generat, no només acceptar-lo.
