# Implementation Plan: Customer Management Module

**Branch**: `001-crm-module-management` | **Date**: April 7, 2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-crm-module-management/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement a CRM module in the admin panel for managing restaurant customers. Primary requirement: Add a new "Customers" section with a searchable list view displaying customer details and status badges, plus a details modal for viewing booking history, editing preferences/tags/allergens, toggling VIP/blacklist status, and adding internal notes. Technical approach: Leverage existing Prisma Customer/CustomerNote models and backend controllers/services; add new frontend CustomersPage.tsx with API integration, following existing admin UI patterns.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

## Technical Context

**Language/Version**: Node.js + Express (ES6+), React + TypeScript  
**Primary Dependencies**: Prisma Client, Joi, Winston, Axios  
**Storage**: PostgreSQL  
**Testing**: NEEDS CLARIFICATION (constitution prohibits tests)  
**Target Platform**: Web application (Linux server)  
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: Search results <0.5s, customer details <3 clicks  
**Constraints**: No raw SQL, no `any` in TypeScript, Dockerized environment  
**Scale/Scope**: Up to 10,000 customers, real-time search and modal interactions

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The implementation plan MUST verify the following gates derived from the project
constitution before research or implementation proceeds:

- Backend validation: Joi is used for all API inputs where applicable.
- Database: Schema changes are implemented only via `backend/prisma/schema.prisma`
  and `npx prisma migrate dev`; no manual DB edits.
- Logging: Winston is configured for backend services.
- Frontend: TypeScript is used with NO `any` types; API calls centralized in
  `src/services/`.
- Infrastructure: Project is Dockerized and `docker-compose` files are present.
- Security: Staff auth uses JWT; password hashing via `bcryptjs`.
- Prohibitions: NO raw SQL and NO tests (project policy).

Plans or design docs that violate these gates MUST include a written justification
and an explicit approval from project maintainers.

## Project Structure

### Documentation (this feature)

```text
specs/001-crm-module-management/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── controllers/backoffice/customerController.js
│   ├── services/customerService.js
│   ├── routes/customers.js
│   └── index.js
└── prisma/schema.prisma

frontend/
├── src/
│   ├── pages/admin/CustomersPage.tsx
│   ├── services/api.ts
│   ├── types/index.ts
│   └── App.tsx
└── package.json
```

**Structure Decision**: Web application structure with separate backend and frontend directories. Backend uses existing patterns for controllers/services/routes. Frontend adds new admin page and extends API services.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
