# 📚 YourMuseum Project Documentation & Architecture Handbook

Comprehensive developer and AI Agent documentation for the **YourMuseum** platform (Next.js Frontend & NestJS/MongoDB Backend).

---

## 🎨 Frontend Documentation (`markdown/frontend/`)

| File | Title | Description |
|---|---|---|
| [01-frontend-architecture-and-structure.md](./frontend/01-frontend-architecture-and-structure.md) | **Architecture & Directory Structure** | Blueprint of Next.js App Router, folder tree, page vs section vs component rules, admin layout. |
| [02-frontend-design-system-and-tokens.md](./frontend/02-frontend-design-system-and-tokens.md) | **Design System & Tokens** | Typography (Playfair & Jost), CSS variable palette, frame swatches (Gold, Silver white, Silver), badges & buttons. |
| [03-frontend-state-management-and-data-flow.md](./frontend/03-frontend-state-management-and-data-flow.md) | **State Management & Data Flow** | Zustand stores (cart, wishlist, currency) with persistence, API dual-mode fallback, hydration safeguards. |
| [04-frontend-business-rules-and-constraints.md](./frontend/04-frontend-business-rules-and-constraints.md) | **Business Rules & Constraints** | Strict product positioning (no fake oil painting claims), BDT (৳) pricing, Feet/cm sizing, Dhaka delivery fees. |
| [05-frontend-pages-and-routing-guide.md](./frontend/05-frontend-pages-and-routing-guide.md) | **Pages & Routing Guide** | Route walkthrough: Home, Shop, Painting detail, Story mode, Artists, Cart, and full Admin Panel views. |
| [06-frontend-coding-standards-and-best-practices.md](./frontend/06-frontend-coding-standards-and-best-practices.md) | **Coding Standards & Agent Practices** | TypeScript strict types, client/server boundaries, Next/Image optimization, step-by-step feature protocol. |

---

## 🍃 Backend Documentation (`markdown/backend/`)

| File | Title | Description |
|---|---|---|
| [01-backend-architecture-and-structure.md](./backend/01-backend-architecture-and-structure.md) | **Architecture & Directory Structure** | NestJS modular architecture, folder layout, dependency injection, global `/api` prefix, CORS. |
| [02-backend-database-and-mongoose-schemas.md](./backend/02-backend-database-and-mongoose-schemas.md) | **Database & Mongoose Schemas** | MongoDB collections, Mongoose schemas (`Painting`, `Artist`, `Order`, `SiteConfig`, `HomeData`, `ContentStore`), indexes. |
| [03-backend-api-routes-and-controllers.md](./backend/03-backend-api-routes-and-controllers.md) | **API Routes & Controllers** | Complete REST API contract, HTTP methods, query filters (`bestseller`, `movement`, `search`), request/response JSON. |
| [04-backend-dto-validation-and-error-handling.md](./backend/04-backend-dto-validation-and-error-handling.md) | **DTO Validation & Error Handling** | Class-validator DTOs, `ValidationPipe` whitelist, global `AllExceptionsFilter`, execution timer interceptor. |
| [05-backend-seeding-and-environment-config.md](./backend/05-backend-seeding-and-environment-config.md) | **Seeding & Environment Config** | Local MongoDB vs Atlas configuration in `.env`, running `npm run seed`, idempotency, and data recovery. |
| [06-backend-coding-standards-and-agent-guidelines.md](./backend/06-backend-coding-standards-and-agent-guidelines.md) | **Coding Standards & Agent Protocol** | Lean controllers, typed models, avoiding circular dependencies, step-by-step implementation protocol for agents. |
