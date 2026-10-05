# TechnoFind — Application Web d'Actualités

> Agrégateur d'actualités mondiales en temps réel, personnalisé et propulsé par l'IA.

## Stack technique

| Couche       | Technologie                                      |
|-------------|--------------------------------------------------|
| Frontend    | Next.js 14, TypeScript 5, Tailwind CSS 3         |
| UI          | Shadcn/ui + Radix UI, Lucide Icons               |
| State       | Zustand + React Query (TanStack)                 |
| Auth        | JWT (RS256), Firebase Auth (OAuth social)        |
| Base données| MongoDB Atlas (articles), PostgreSQL (users)     |
| Cache       | Redis (Upstash — free tier)                      |
| APIs        | NewsAPI, Guardian API                            |
| IA          | OpenAI GPT-4o-mini, Google Translate, Cloud TTS  |
| PWA         | next-pwa + Workbox                               |
| Hosting     | Vercel (free tier)                               |

## Démarrer en local

```bash
# 1. Copier les variables d'environnement
cp .env.local.example .env.local
# → Remplir NEWSAPI_KEY, MONGODB_URI, JWT_SECRET

# 2. Installer les dépendances
npm install

# 3. Lancer en développement
npm run dev
# → http://localhost:3000
```

## Scripts disponibles

```bash
npm run dev        # Serveur de développement
npm run build      # Build production
npm run start      # Serveur production
npm run lint       # ESLint
npm run type-check # Vérification TypeScript
npm test           # Tests Jest
```

## Structure du projet

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Pages login, register
│   ├── (main)/             # Pages feed, search, trends, saved, profile
│   ├── api/                # Route handlers (REST API)
│   ├── layout.tsx          # Root layout (fonts, providers)
│   └── providers.tsx       # React Query provider
├── components/
│   ├── layout/             # NavBar, Sidebar
│   ├── feed/               # ArticleCard, FeedPage, CategoryTabs
│   ├── article/            # Lecteur article, TTS
│   ├── search/             # SearchBar, Filters
│   └── ui/                 # Composants atomiques (Button, Input…)
├── lib/
│   ├── api/                # Clients NewsAPI, HTTP client
│   ├── auth/               # JWT helpers, middleware
│   ├── db/                 # Connexion MongoDB
│   ├── hooks/              # React Query hooks
│   ├── utils/              # cn(), date helpers
│   └── validators/         # Schémas Zod
├── store/                  # Zustand stores (auth, feed)
├── styles/                 # globals.css
└── types/                  # Types TypeScript globaux
```

## Phases de développement

- **Phase 1 (MVP)** : Feed, auth, recherche, PWA ← *en cours*
- **Phase 2** : Alertes, sauvegarde, notifications push, partage social
- **Phase 3** : Traduction IA, lecteur vocal, recommandations
- **Phase 4** : Tests, optimisations, déploiement production
