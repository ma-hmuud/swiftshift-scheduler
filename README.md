# Employee Scheduler App - Development Plan

---

## Todo

### Phase 1: Foundation

- [x] Tech stack setup (Next.js, tRPC, Drizzle, etc.)
- [x] Define your database schema in Drizzle

### Phase 2: Core Data Layer (API routes)

Build your tRPC procedures in this order:

- [x] Auth first - signup, login, session management
- [x] Manager Setup - create manager accounts, assign employees
- [x] Shift CRUD - create, read, update, delete shifts (manager only)
- [x] Availability - set employee availability
- [x] Shift requests - submit request, approve/reject (split by role)

### Phase 3: UI Components (Feature by feature)

Build one complete feature at a time, not all pages at once:

- [x] Feature 1: Auth flow

Login/signup pages → test → move on

- [ ] Feature 2: Manager creates shifts

Shift creation form → shift list view → test

- [ ] Feature 3: Employee requests shifts

Available shifts list → request button → my shifts view

- [ ] Feature 4: Manager approves requests

Pending requests table → approve/reject actions

This "vertical slice" approach means each feature is fully working before moving to the next.

### Phase 4: Polish and consistency improvements:

- [ ] Add loading states, error handling styling consistency
