# Tasks: Customer Management Module

**Input**: Design documents from `/specs/001-crm-module-management/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are PROHIBITED for this project per the constitution. Do NOT add test tasks to the generated task lists.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- Paths shown below assume web app structure - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize Node.js + Express (ES6+) backend with Prisma Client, Joi, Winston dependencies
- [ ] T003 Initialize React + TypeScript frontend with Axios dependencies
- [ ] T004 [P] Configure linting and formatting tools for backend
- [ ] T005 [P] Configure linting and formatting tools for frontend

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Setup database schema and migrations framework with Prisma
- [ ] T007 [P] Implement authentication/authorization framework with JWT
- [ ] T008 [P] Setup API routing and middleware structure in backend/src/
- [ ] T009 Create base Customer and CustomerNote models in backend/prisma/schema.prisma
- [ ] T010 Configure error handling and logging infrastructure with Winston
- [ ] T011 Setup environment configuration management

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Searchable Customer Global List (Priority: P1) 🎯 MVP

**Goal**: Staff can view a searchable global list of all customers with key details like name, email, phone, visits, and status badges.

**Independent Test**: Can be fully tested by loading the customers page, verifying the list displays, and performing searches without needing other features like details modal.

### Implementation for User Story 1

- [ ] T012 [P] [US1] Implement GET /api/customers endpoint in backend/src/controllers/backoffice/customerController.js
- [ ] T013 [P] [US1] Implement customer list service in backend/src/services/customerService.js
- [ ] T014 [US1] Add customer routes in backend/src/routes/customers.js
- [ ] T015 [US1] Mount customer routes in backend/src/index.js
- [ ] T016 [P] [US1] Create CustomersPage.tsx in frontend/src/pages/admin/CustomersPage.tsx
- [ ] T017 [P] [US1] Add customer API helpers in frontend/src/services/api.ts
- [ ] T018 [US1] Add Customers link to sidebar in frontend/src/pages/admin/AdminLayout.tsx
- [ ] T019 [US1] Register customers route in frontend/src/App.tsx
- [ ] T020 [US1] Extend Customer interface in frontend/src/types/index.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Manage Allergens and Preferences (Priority: P2)

**Goal**: Staff can view and edit customer preferences, tags, and allergens in a details modal.

**Independent Test**: Can be tested by opening a customer details modal and editing fields without affecting list functionality.

### Implementation for User Story 2

- [ ] T021 [P] [US2] Implement GET /api/customers/:id endpoint in backend/src/controllers/backoffice/customerController.js
- [ ] T022 [P] [US2] Implement PATCH /api/customers/:id endpoint in backend/src/controllers/backoffice/customerController.js
- [ ] T023 [US2] Implement customer details and update service in backend/src/services/customerService.js
- [ ] T024 [P] [US2] Add details modal to CustomersPage.tsx
- [ ] T025 [US2] Add customer details API helpers in frontend/src/services/api.ts
- [ ] T026 [US2] Add customer update API helpers in frontend/src/services/api.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Toggle VIP or Blacklist (Priority: P3)

**Goal**: Staff can quickly toggle VIP status or blacklist a customer with a reason, including viewing internal notes.

**Independent Test**: Can be tested by toggling statuses in the modal and verifying backend updates without full profile editing.

### Implementation for User Story 3

- [ ] T027 [P] [US3] Implement POST /api/customers/:id/notes endpoint in backend/src/controllers/backoffice/customerController.js
- [ ] T028 [US3] Implement notes service in backend/src/services/customerService.js
- [ ] T029 [P] [US3] Add VIP/blacklist toggle to details modal in CustomersPage.tsx
- [ ] T030 [US3] Add notes section to details modal in CustomersPage.tsx
- [ ] T031 [US3] Add notes API helpers in frontend/src/services/api.ts
- [ ] T037 [US3] Implement blacklist check in backend/src/controllers/backoffice/bookingController.js
- [ ] T038 [US1/US3] Implement conditional red background for blacklisted rows in frontend/src/pages/admin/CustomersPage.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T032 [P] Documentation updates in specs/001-crm-module-management/
- [ ] T033 Code cleanup and refactoring
- [ ] T034 Performance optimization across all stories
- [ ] T035 Security hardening
- [ ] T036 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all models for User Story 1 together:
Task: "Implement GET /api/customers endpoint in backend/src/controllers/backoffice/customerController.js"
Task: "Create CustomersPage.tsx in frontend/src/pages/admin/CustomersPage.tsx"
Task: "Add customer API helpers in frontend/src/services/api.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence