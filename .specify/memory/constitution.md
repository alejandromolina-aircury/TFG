<!--
Sync Impact Report

Version change: unset -> 1.0.0
Modified principles:
- [PRINCIPLE_1_NAME] -> I. Mission & Context
- [PRINCIPLE_2_NAME] -> II. Core Technical Stack
- [PRINCIPLE_3_NAME] -> III. Architecture & Design Patterns
- [PRINCIPLE_4_NAME] -> IV. Absolute Domain Rules
- [PRINCIPLE_5_NAME] -> V. Coding Standards & Prohibited Practices
Added sections:
- Operational Constraints (was [SECTION_2_NAME])
- Development Workflow (was [SECTION_3_NAME])
Removed sections: none
Templates requiring updates:
- .specify/templates/plan-template.md ✅ updated
- .specify/templates/spec-template.md ✅ updated
- .specify/templates/tasks-template.md ✅ updated
- .specify/templates/constitution-template.md ⚠ pending (template kept generic)
Follow-up TODOs:
- None deferred; all placeholders replaced. Dates set to ratification on adoption.
-->

# Motor de Reservas Constitution

## Core Principles

### I. Mission & Context
The project MUST build a robust, professional-grade restaurant reservation engine that acts
as a centralized platform for customer management, seating zones, tables, operational
shifts, and the full booking lifecycle. All features and designs MUST align with this
mission and prioritize operational correctness, data integrity, and auditable booking history.

### II. Core Technical Stack
- Backend: Node.js + Express (JavaScript ES6+). MUST use existing code patterns in `backend/`.
- Database & ORM: PostgreSQL accessed exclusively via Prisma Client. Direct SQL is
  PROHIBITED except where Prisma cannot express an operation and a formal exception is
  documented and approved.
- Frontend: React (Vite) with TypeScript. Use TypeScript for all frontend code; `any` is
  PROHIBITED.
- Validation: Joi MUST be used for all backend API input validation.
- Logging: Winston MUST be used for contextual logging in backend services.
- Infrastructure: The project MUST be fully Dockerized using `docker-compose` for
  development and production parity.

### III. Architecture & Design Patterns
- Backend MUST follow the Routes → Controllers → Services pattern. Controllers MUST be
  thin; all business logic belongs in Services.
- Frontend MUST use functional components with custom hooks and centralize API calls in
  `src/services/` using Axios with a unified base configuration.
- Database migrations and schema changes MUST be performed by editing
  `backend/prisma/schema.prisma` and running `npx prisma migrate dev`. Manual DB
  modifications are NOT ALLOWED.

### IV. Absolute Domain Rules
- Booking status flow is fixed and MUST be enforced: `PENDING` → `CONFIRMED` → `SEATED`
  → `COMPLETED`. Historical states such as `CANCELLED` and `NO_SHOW` MUST be recorded
  without violating history integrity.
- Tables MUST belong to a `Zone`. Table capacity constraints (`minCapacity`,
  `maxCapacity`) MUST be validated prior to any table assignment.
- Reservations are valid only within defined `Shifts` and MUST respect global or
  shift-specific `Closures`.

### V. Coding Standards & Prohibited Practices
- Language: All code identifiers MUST be in English. Documentation/comments clarifying
  domain-specific TFG logic MAY be Spanish where helpful, but public API and code MUST
  remain English.
- Security: Staff authentication MUST use JWTs. Passwords MUST be hashed with
  `bcryptjs` with an appropriate salt rounds configuration documented in
  `backend/config/constants.js`.
- Error handling: APIs MUST return consistent HTTP status codes and structured
  error objects for consumers (200, 201, 400, 401, 403, 404, 500 as applicable).
- Prohibited practices (NON-NEGOTIABLE):
  - NO raw SQL (use Prisma Client only unless an approved exception exists).
  - NO `any` in TypeScript.
  - NO secrets committed in source control; use `.env` and provide an `.env.example`.
  - NO tests for this project (tests are explicitly PROHIBITED by project policy).

## Operational Constraints
Environment, deployment, and operational constraints derived from the constitution:
- All runtime configuration MUST be supplied via environment variables and documented in
  `.env.example` at the repository root.
- Docker Compose files at `docker-compose.yml` and `docker-compose.prod.yml` MUST be
  kept in sync with service dependencies and documented startup order.
- Migration policy: Edit `backend/prisma/schema.prisma` → run `npx prisma migrate dev`
  → update `backend/prisma/migrations/` commits. Migration scripts MUST be included in
  PRs that change schema.

## Development Workflow
- Branching: Feature branches MUST be named `feat/<short-desc>`; hotfix branches
  `fix/<short-desc>`.
- PRs that modify backend or DB schema MUST include a migration plan and a list of
  required operational steps (deploy order, migrations, feature flags if any).
- Code review: At least one maintainer review is REQUIRED for all PRs that affect
  business logic, schema, or infra.
- Linters/formatters: Frontend TypeScript and backend JavaScript follow the repo's
  ESLint/Prettier configuration. CI checks MUST fail on lint/type errors.

## Governance
Amendments to this constitution MUST follow the process below:
- Proposal: A change MUST be documented in a PR referencing this file and the
  rationale for the amendment.
- Review: At least two maintainers MUST approve constitution changes.
- Migration Plan: Any amendment that affects runtime behavior, DB schema, or
  operational processes MUST include a migration and rollback plan.

Versioning policy:
- Semantic versioning for governance: MAJOR for incompatible governance changes,
  MINOR for added principles or new required policies, PATCH for wording or
  clarifications.

Compliance reviews:
- All PRs MUST include a short compliance checklist referencing the relevant
  constitution sections (e.g., validation, logging, migrations) before merge.

**Version**: 1.0.0 | **Ratified**: 2026-04-07 | **Last Amended**: 2026-04-07
