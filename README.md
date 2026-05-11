# TaskFlow — Gestor de Tasques amb Assistent IA

Una Progressive Web App (PWA) per gestionar tasques diàries amb un assistent d'intel·ligència artificial integrat (Claude d'Anthropic).

## Funcionalitats

- **Gestió de tasques**: crea, completa i elimina tasques amb títol, descripció, prioritat i data límit
- **Filtres**: filtra per estat (actives/completades) i prioritat (alta/mitjana/baixa)
- **Persistència local**: les tasques es guarden a localStorage i es restauren en recarregar
- **Assistent IA**: xat integrat amb Claude que coneix les teves tasques i et pot ajudar a organitzar-te
- **PWA instal·lable**: l'app es pot instal·lar al dispositiu com una app nativa

## Stack tecnològic

| Capa | Tecnologia |
|---|---|
| Frontend | Nuxt 3 (Vue 3 + Composition API) |
| Estils | Tailwind CSS |
| Serverless | Nitro (Nuxt server routes) |
| IA | Anthropic SDK (Claude claude-sonnet-4-6) |
| PWA | @vite-pwa/nuxt |

## Estructura del projecte

```
taskflow/
├── app/
│   ├── app.vue                    # Layout principal i lògica de filtres
│   ├── assets/css/main.css        # Tailwind CSS
│   ├── components/
│   │   ├── TaskForm.vue           # Formulari per crear tasques
│   │   ├── TaskCard.vue           # Targeta de tasca individual
│   │   └── ChatPanel.vue          # Panell lateral del xat IA
│   └── composables/
│       └── useTasks.ts            # Estat i persistència de tasques
├── server/api/
│   └── chat.post.ts               # Endpoint serverless → Claude API
├── SPEC.md                        # Especificació tècnica del sistema
├── PROCESS.md                     # Registre del procés de desenvolupament amb IA
└── .env.example                   # Plantilla de variables d'entorn
```

## Posada en marxa

### 1. Clona el repositori

```bash
git clone https://github.com/a20valzavvas/taskflow.git
cd taskflow
```

### 2. Instal·la les dependències

```bash
npm install
```

### 3. Configura les variables d'entorn

```bash
cp .env.example .env
```

Edita `.env` i afegeix la teva clau d'API d'Anthropic:

```
ANTHROPIC_API_KEY=sk-ant-...
```

### 4. Inicia el servidor de desenvolupament

```bash
npm run dev
```

Obre [http://localhost:3000](http://localhost:3000) al navegador.

## Desplegament

```bash
npm run build
npm run preview
```

## Metodologia

Aquest projecte segueix la metodologia **Specification-Driven Development (SDD)**. Consulta [SPEC.md](SPEC.md) per a l'especificació tècnica completa i [PROCESS.md](PROCESS.md) per al registre del procés de desenvolupament amb IA.
