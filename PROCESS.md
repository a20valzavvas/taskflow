# PROCESS.md — Registre del Procés de Desenvolupament amb IA

## Resum del procés

Aquest projecte s'ha desenvolupat seguint la metodologia **Specification-Driven Development (SDD)** utilitzant **Claude Code** com a agent principal de desenvolupament. El procés ha estat iteratiu: primer definir l'arquitectura, després generar el codi, i finalment revisar, corregir i millorar el resultat.

---

## Fase 1 — Definició de l'arquitectura amb IA

### Prompt inicial

> "Necessito construir una PWA amb Nuxt.js que permeti gestionar tasques i tingui un chatbot integrat. Proposa'm una arquitectura tècnica amb Nuxt 3, serverless i integració d'IA."

### Resposta de l'agent (resum)

L'agent va proposar:
- **Frontend**: Nuxt 3 amb Vue 3 Composition API + Tailwind CSS
- **Serverless**: Nitro server routes per protegir la API Key al servidor
- **Persistència**: localStorage al client (sense base de dades externa)
- **PWA**: `@vite-pwa/nuxt` per fer l'app instal·lable
- **Chatbot**: Ruta `/api/chat` que rep missatge + context de tasques i retorna la resposta de l'assistent

### Decisió presa

S'ha acceptat l'arquitectura proposada amb una modificació: en lloc d'usar una base de dades externa, s'ha optat per localStorage per simplicitat, donada la naturalesa personal de l'app (un sol usuari per dispositiu).

---

## Fase 2 — Creació de l'especificació (SPEC.md)

### Prompt utilitzat

> "Crea un document SPEC.md complet per a l'app TaskFlow. Ha d'incloure: descripció funcional, actors, user journey, estructura de dades TypeScript, endpoints serverless i comportament del chatbot."

### Iteració

Primera versió generada per l'agent. Es van fer les correccions manuals següents:
- Afegir la taula de comportament del chatbot per idioma (català/castellà)
- Aclarir que l'assistent no pot crear ni eliminar tasques directament
- Afegir el diagrama d'arquitectura en ASCII

---

## Fase 3 — Implementació pas a pas

### 3.1 Configuració del projecte

```
Prompt: "Inicialitza un projecte Nuxt 3 amb TypeScript, Tailwind CSS v4
i @vite-pwa/nuxt. Configura nuxt.config.ts amb runtimeConfig per a la
clau d'API i el manifest PWA."
```

**Resultat**: L'agent va generar la configuració de `nuxt.config.ts` amb la integració de Tailwind usant `@tailwindcss/vite` (Tailwind v4, sense fitxer de configuració JS).

### 3.2 Composable useTasks

```
Prompt: "Crea un composable useTasks.ts que gestioni l'estat de les
tasques amb useState de Nuxt i persisteixi a localStorage. Ha d'incloure
addTask, toggleTask, deleteTask i loadFromStorage."
```

**Revisió crítica**: Es va verificar que `import.meta.client` s'usa correctament per evitar errors de SSR — el `localStorage` no existeix al servidor, i Nuxt renderitza primer al servidor.

### 3.3 Components Vue

```
Prompt: "Crea TaskForm.vue, TaskCard.vue i ChatPanel.vue amb Tailwind.
TaskCard ha de mostrar prioritat amb colors i permetre completar/eliminar.
ChatPanel ha de tenir historial de missatges, input i indicador de càrrega."
```

**Bug detectat i solucionat**: En la primera versió, `TaskCard` usava `props.task` directament en el template sense `computed`, causant warnings de reactivitat. Es va corregir envoltant les propietats derivades en `computed()`.

### 3.4 Ruta serverless /api/chat

```
Prompt: "Crea server/api/chat.post.ts que llegeixi la clau d'API de
runtimeConfig, construeixi un system prompt amb les tasques actives
de l'usuari i cridi el model d'IA amb l'historial de conversa."
```

**Revisió de seguretat**: Es va comprovar que la clau d'API mai s'exposa al client — s'usa `useRuntimeConfig()` al servidor (sense `.public`), de manera que la clau queda fora del bundle del navegador.

---

## Fase 4 — Bug crític: migració d'Anthropic a Groq

### Problema

En provar el chatbot per primera vegada, l'endpoint `/api/chat` retornava un error 400:

```json
{
  "error": "Your credit balance is too low to access the Anthropic API.
  Please go to Plans & Billing to upgrade or purchase credits."
}
```

El codi era correcte, però el compte d'Anthropic no tenia saldo.

### Solució: migració a Groq

Es va decidir migrar a **Groq** — una alternativa gratuïta que ofereix models Llama 3.1 amb una API compatible. Els passos van ser:

1. Crear compte i API key a [console.groq.com](https://console.groq.com)
2. Instal·lar `groq-sdk` i desinstal·lar `@anthropic-ai/sdk`
3. Reescriure `server/api/chat.post.ts` adaptant la crida al format de Groq
4. Actualitzar `nuxt.config.ts`: `anthropicApiKey` → `groqApiKey`
5. Actualitzar `.env`: `ANTHROPIC_API_KEY` → `GROQ_API_KEY`
6. Actualitzar totes les referències als docs (SPEC.md, README.md, PROCESS.md)

```
Prompt: "Migra server/api/chat.post.ts d'Anthropic SDK a groq-sdk.
Usa el model llama-3.1-8b-instant. L'estructura de la crida és similar
a l'API d'OpenAI: client.chat.completions.create amb un array messages
que inclou el system prompt."
```

**Resultat**: El chatbot va funcionar immediatament després de la migració.

---

## Fase 5 — Disseny UI i millores visuals

### 5.1 Redisseny amb paleta cozy

```
Prompt: "Redisenya l'app amb una paleta de colors càlida i acollidora
usant aquests colors: #E0DFE8, #9CB6D9, #6F7356, #D9BB96, #A67244.
Afegeix icones de Lucide Vue per millorar la usabilitat."
```

**Resultat**: Canvi complet de paleta (`slate` → `stone` + colors personalitzats via `@theme` de Tailwind v4). S'han afegit icones de `lucide-vue-next` a tots els components: `CheckCircle2`, `Flame`, `Trash2`, `Send`, `Bot`, `Sparkles`, etc.

### 5.2 Selector de temes de color

```
Prompt: "Afegeix un selector de temes al header que permeti canviar
entre la paleta earthy (verda) i una nova paleta rosa (#70343B, #FFC2C9,
#ED6D7C, #70393F, #BD5763). Usa CSS custom properties per fer el canvi
automàtic a tots els components."
```

**Implementació**: Les variables CSS es defineixen a `main.css` sota `@theme` (default) i `[data-theme="rose"]` (override). En clicar el selector, s'aplica `data-theme` a `document.documentElement` i el canvi es propaga automàticament a tot l'app sense recarregar.

### 5.3 Bug SSR: localStorage en la inicialització del tema

En afegir el selector de temes, l'app va donar error 500:

```
localStorage.getItem is not a function
```

**Causa**: La línia `const theme = ref(localStorage.getItem('theme') ?? 'earthy')` s'executava durant el SSR al servidor, on `localStorage` no existeix.

**Solució**:
```ts
// ❌ Incorrecte — s'executa al servidor
const theme = ref(localStorage.getItem('theme') ?? 'earthy')

// ✅ Correcte — comprova si estem al navegador
const theme = ref(import.meta.client ? (localStorage.getItem('theme') ?? 'earthy') : 'earthy')
```

### 5.4 Transició d'icones al botó de l'assistent

```
Prompt: "Afegeix una transició suau al botó 'Assistent IA' perquè
l'icona canviï de BotOff (inactiu) a Bot (actiu) amb un efecte de
fade + scale + rotació lleugera."
```

S'ha usat el component `<Transition>` de Vue amb `mode="out-in"` per evitar que els dos icones se solapin durant el canvi.

---

## Fase 6 — Integració i proves

### Prova del chatbot

**Missatge enviat**: "Quines tasques tinc pendents d'alta prioritat?"

**Resposta de l'assistent**: Va llistar correctament les tasques actives amb prioritat alta, demostrant que el context de tasques s'envia correctament al model.

**Missatge enviat**: "Ajuda'm a planificar el matí"

**Resposta de l'assistent**: Va proposar un ordre raonable basat en les dates límit i prioritats de les tasques actives.

### Prova de persistència

Es van afegir 3 tasques, es va recarregar la pàgina i les tasques es van restaurar correctament des de localStorage.

### Prova del selector de temes

Es va canviar entre tema verd i rosa: tots els components (header, targetes, formulari, xat) van canviar de colors instantàniament sense recarregar la pàgina. El tema escollit es va restaurar correctament en recarregar gràcies a `localStorage`.

---

## Fase 7 — Reflexió final

### Què ha funcionat bé

- L'especificació prèvia (SPEC.md) va permetre que l'agent generés codi coherent des del primer moment, sense haver de corregir l'arquitectura general.
- Separar la ruta `/api/chat` al servidor va ser una decisió correcta: la clau d'API mai queda exposada al navegador.
- El sistema de CSS custom properties per als temes va resultar elegant: un sol canvi d'atribut a `<html>` propaga el canvi a tota l'app.
- `lucide-vue-next` va ser fàcil d'integrar i va millorar considerablement la llegibilitat de la interfície.

### Què ha requerit revisió manual

- La primera versió de `nuxt.config.ts` no incloïa la configuració PWA correctament.
- El composable `useTasks` requeria `import.meta.client` per evitar errors SSR — l'agent no ho va incloure inicialment.
- La migració d'Anthropic a Groq va requerir entendre les diferències entre les dues APIs (format de missatges, nom dels paràmetres).
- L'error de `localStorage` en la inicialització del tema va aparèixer perquè Nuxt 4 fa SSR per defecte — cal ser conscient de quines APIs del navegador no estan disponibles al servidor.

### Aprenentatges

- Una bona especificació redueix dràsticament el nombre d'iteracions necessàries amb l'agent.
- L'agent és molt eficaç per generar codi boilerplate i components, però cal revisar els detalls de seguretat (exposició de claus, SSR/client boundaries).
- Quan un servei extern no funciona (Anthropic sense saldo), cal saber identificar alternatives ràpidament i fer la migració de forma sistemàtica.
- Actuar com a *tech lead* significa entendre el codi generat, no només acceptar-lo: cada bug solucionat en aquesta pràctica va requerir comprendre primer per què fallava.
