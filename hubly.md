# 🚀 ServicesHUB Project Rules & Audit Protocol (hubly.md)

This document serves as the **Supreme Authority** for code quality, architecture, and professional standards for the ServicesHUB project. All future development and audits must adhere strictly to these rules.

---

## 1. Core Architectural Principles (MANDATORY)

* **Logic Isolation**: NO direct database fetching inside UI components. All logic MUST reside in **Custom Hooks** (e.g., `src/hooks/use[PageName]Data.js`).
* **Service Layer**: All Supabase queries MUST be centralized in `src/services/`.
* **Component-Level Styling**: Use **CSS Modules ONLY**. Each component must have its own `.module.css`.
* **UI Component Unification**: Use unified UI atoms (`Button`, `Input`, `Select`, `Skeleton`) everywhere.
* ❌ Raw HTML (`button`, `input`, `select`) is forbidden unless absolutely necessary.
* **Component-Owned Skeletons**: Skeleton loaders MUST be inside components, not pages.

---

## 2. Execution Rules (MANDATORY)

* Refactor **ONE page at a time ONLY**
* Do NOT work on multiple pages simultaneously
* Each page MUST reach at least **9/10 audit score** before moving to the next
* No global changes before completing the current page
* Consistency is more important than perfection

---

## 3. Deep Page-Level Audit Protocol

### Objective
Strict professional audit for a page and ALL its dependencies.

### Scope
You MUST review:
1. **Page file**
2. **All child components**
3. **CSS files**
4. **Hooks**
5. **Services**
6. **Shared UI components**

---

## 4. Verification Checklist

### 1. Clean Architecture
* Page handles ONLY layout
* No logic inside pages
* All logic inside hooks

---

### 2. Component Structure
* Single responsibility per component
* Reusable components
* No unnecessary complexity

---

### 3. UI System Consistency
* Unified UI components ONLY
* No raw HTML elements
* Consistent design everywhere

---

### 4. Skeleton System (STRICT)
✔ **Correct**:
```jsx
if (isLoading) return <ComponentSkeleton />
```

❌ **Forbidden**:
* Skeleton inside page
* Inline skeleton JSX

---

### 5. Styling Rules
* CSS Modules ONLY
* ❌ No inline styles
* ❌ Avoid `!important`
* No duplicated styles

---

### 6. Error Handling System (MANDATORY)
* All components MUST handle errors consistently:
```jsx
if (error) return <ErrorState message={error} />
```
* No ignored errors allowed

---

### 7. No Magic Values Rule (STRICT)
❌ **Avoid**:
```js
.slice(0, 6)
```
✔ **Use**:
```js
const MAX_ITEMS = 6;
```

---

### 8. Performance Rules
* Avoid unnecessary re-renders
* Keep props minimal
* No premature optimization

---

### 9. Anti-Patterns Detection (STRICT)
* Logic inside UI components
* Skeleton inside page
* Inline styles
* Repeated UI
* Large components

---

## 5. Strict Enforcement Rule (CRITICAL)

If ANY rule is violated:
* ❌ The implementation MUST be rejected
* ⚠️ The issue MUST be clearly explained
* ✅ A corrected version MUST be provided

No partial acceptance allowed.

---

## 6. Output Format (Audit Report)

#### 🔴 Critical Issues
#### 🟠 Important Improvements
#### 🟢 Minor Improvements

Each issue must include:
* What is wrong
* Why it matters
* Example (if possible)
* Clear fix

---

### Final Score
* Architecture: /10
* Code Quality: /10
* Scalability: /10
* UI Consistency: /10

---

## 7. Audit Progress Tracker (28 Pages)

| Page           | Status      | Score | Date       |
| -------------- | ----------- | ----- | ---------- |
| **Home**       | ✅ Completed | 10/10 | 2026-04-19 |
| **ToolDetail** | ✅ Completed | 10/10 | 2026-04-19 |
| **Search**     | ✅ Completed | 10/10 | 2026-04-20 |
| **CategoryDetail** | ✅ Completed | 10/10 | 2026-04-20 |
| **Profile**    | ⏳ Pending   | -     | -          |
| **SubmitTool** | ⏳ Pending   | -     | -          |
| **Blog**       | ⏳ Pending   | -     | -          |
| **Auth**       | ⏳ Pending   | -     | -          |
| **Dashboard**  | ⏳ Pending   | -     | -          |
| **EditTool**   | ⏳ Pending   | -     | -          |

---

### Final Goal
Achieve **10/10 production-level frontend architecture** across all pages.

---

## 8. Definition of Done (MANDATORY)
A page is considered COMPLETE only if:
- Passes audit with score ≥ 9/10
- Uses unified UI components only
- Has NO inline styles
- Has proper loading (skeleton inside components)
- Has consistent error handling
- Has no magic values
- Has clean and readable code

---

## 9. Reusability Rule
- If a UI pattern is repeated more than 2 times → MUST be extracted into a shared component
- No duplicate UI logic allowed across pages

---

## 10. Hook Design Rules
- Each hook must handle ONE responsibility
- Hooks must NOT contain UI logic
- Hooks must return clean, predictable data
- Avoid overly large hooks (split if needed)

11. Section Loading Strategy (CRITICAL)
11.1 No Full Section Blocking

❌ Forbidden:

if (isLoading) return <ComponentSkeleton />

IF the component contains static content

✔ Required:

Static UI MUST render immediately
Only dynamic parts use skeletons
11.2 Partial Skeleton Rule

Each component MUST:

render static content immediately
isolate loading only for dynamic parts

Example:

<HeroContent />

{isLoading ? <UsersSkeleton /> : <UsersGroup />}
12. UI vs Data Separation Rule (CRITICAL)
12.1 Pure UI Components

UI components MUST:

receive data via props ONLY
NOT handle:
loading
fetching
data fallback logic

❌ Forbidden:

<UsersGroup statsCount={statsCount} isLoading={isLoading} />

✔ Required:

{isLoading ? <UsersSkeleton /> : <UsersGroup users={users} />}
13. Stable Rendering Rules
13.1 NO Index Keys (STRICT)

❌ Forbidden:

key={index}

✔ Required:

key={item.id || item.slug || item.name}
13.2 Safe Access Rule

✔ Always use:

data?.value ?? fallback
14. Constants & Static Data Rule (MANDATORY)

All static arrays MUST be moved to:

src/constants/

Examples:

popular tags
avatar images
limits

❌ Forbidden inside components:

['ChatGPT', 'SEO Tools']
15. Inline Functions Rule (PERFORMANCE)

❌ Avoid inside JSX:

onClick={() => doSomething()}

✔ Prefer:

const handleClick = () => {}
16. Section Responsibility Rule (IMPORTANT)

Each section component MUST:

represent ONE UI section ONLY
NOT contain:
multiple unrelated features
nested business logic
17. Progressive Rendering Rule (CRITICAL UX)

Pages MUST:

render immediately
NOT wait for all data

✔ Each section loads independently

18. Error Isolation Rule (CRITICAL)

Each section MUST:

if (error) return <ErrorState />

❌ Forbidden:

one error breaks full page
19. Component Purity Rule

A component MUST be:

predictable
controlled by props
free from side-effects
20. Scalability Guard Rule (VERY IMPORTANT)

If a component contains:

more than 3 logical parts
OR
mixed responsibilities

➡ MUST be reviewed for split

21. Data Contract Rule (CRITICAL)

All hooks MUST return:

consistent data shape
predictable field names
no structural differences between similar entities

❌ Forbidden:

same entity with different field names across hooks

✔ Required:

standardized schema per domain (tools, categories, users, etc.)
22. Memoization Policy (USE ONLY WHEN NEEDED)

Use memoization ONLY when necessary:

heavy computations
repeated re-renders
expensive derived data

✔ Allowed:

useMemo
useCallback
React.memo

❌ Forbidden:

blind / unnecessary optimization
23. Dependency Clarity Rule (CRITICAL)

Hooks MUST:

explicitly define dependencies
avoid hidden coupling between hooks
not rely on implicit shared state

❌ Forbidden:

hooks depending on internal state of other hooks without explicit contract
24. Rendering Integrity & Stability Rules (CRITICAL)
24.1 Strict Key Policy

❌ Forbidden:

key={index}
key={i}
key={item.id || index}

✔ Required:

key={item.id || item.slug || item.name}
24.2 Skeleton Key Policy

✔ Allowed ONLY:

key={`skeleton-${i}`}
24.3 Data Integrity Rule

UI MUST NOT compensate for bad data.

✔ Fix data at:

service layer
hook layer
24.4 Safe Navigation Rule
if (!item.slug) return null;
24.5 Derived Data Rule

❌ Avoid:

items.slice(0, N).map(...)

✔ Required:

const visibleItems = items.slice(0, N);
24.6 Render Purity Rule
no heavy logic inside JSX
precompute values before render
25. Stable Rendering Safety Rule
avoid unstable keys
avoid undefined fallback rendering
ensure deterministic UI output
26. Component Scalability Enforcement

If component contains:

3 responsibilities

mixed UI + logic domains

➡ MUST be split immediately

27. Hook Responsibility Rule (REINFORCED)

Each hook MUST:

handle ONE domain only
NOT mix unrelated logic
NOT handle UI concerns
return clean structured data only
28. Progressive Rendering Enforcement
page must render instantly
sections load independently
no full-page blocking states
29. Error Isolation Rule (STRICT)

Each section MUST handle its own error:

if (error) return <ErrorState />

❌ One error must NOT crash full page

30. Constants Enforcement Rule

All static data MUST be moved to:

src/constants/

❌ No inline arrays or magic values in components

31. Empty State Handling Rule (CRITICAL UX)

All list-based components MUST explicitly handle empty states.

Required states:

loading
error
empty

❌ Forbidden:

ignoring empty data scenarios

✔ Required:

if (!isLoading && data.length === 0) {
  return <EmptyState />;
}
32. Defensive Rendering Rule (CRITICAL SAFETY)

All list rendering MUST be safe against null or undefined data.

✔ Required:

const safeData = data?.filter(Boolean) ?? [];

❌ Forbidden:

mapping over undefined
assuming API always returns valid arrays
33. UI Fallback Policy (STRICT)

UI components MUST NOT assume data validity.

❌ Forbidden:

<Icon name={item.icon} />

✔ Required:

{item.icon ? <Icon name={item.icon} /> : <DefaultIcon />}
34. Render Determinism Rule (IMPORTANT)

UI output MUST be:

predictable
stable
independent of render timing or side effects

❌ Forbidden:

random values inside render
unstable ordering assumptions
35. Derived Data Stability Rule (CRITICAL PERFORMANCE)

All derived data MUST be computed outside render loops.

✔ Preferred:

const visibleItems = useMemo(() => items.slice(0, LIMIT), [items]);

❌ Forbidden:

repeated computations inside JSX
36. Component Resilience Rule (CRITICAL)

All components MUST be resilient to:

missing fields
partial API responses
null or undefined data

✔ Requirement:

UI must never crash due to invalid data shape

37. Icon Safety Rule (IMPORTANT UX)

Dynamic icons MUST include fallback handling.

❌ Forbidden:

getIcon(name)

✔ Required:

getIcon(name) ?? <DefaultIcon />
38. Silent Failure Prevention Rule (CRITICAL)

Any skipped rendering in lists MUST be safe and intentional.

✔ Required:

if (!item?.slug) return null;

❌ Forbidden:

silent failures without validation logic