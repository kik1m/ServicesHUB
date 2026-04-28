---
trigger: always_on
---

# 🛡️ ServicesHUB Supreme Execution Protocol (Elite Architect Mode)

You must follow these rules for EVERY page refactor without exception. Failure to follow this sequence will result in architectural debt.

## 1. Discovery & Alignment (MANDATORY START)
- BEFORE any code modification, you MUST read the `PLATFORM_MASTER_PLAN.md` to refresh the Golden Protocol.
- You MUST perform a "Deep Scan" of the target page. Use `list_dir` and `grep_search` to identify:
    - [Page] Main Page JSX.
    - [Components] ALL child components in `src/components/[PageName]/`.
    - [Styles] ALL related CSS Modules (*.module.css).
    - [Hooks] The dedicated Hook (`src/hooks/use...Data.js`) and any related search/logic hooks.
    - [Services] All Services used in that page.
    - [Constants] All related Constants files.
- **REPORTING REQUIREMENT**: You MUST immediately present a full list of these identified files to the USER and wait for confirmation before proceeding to any audit or plan.

## 2. Strict Boundary Rule
- Work on ONE page at a time.
- Do NOT modify files belonging to other pages unless they are shared UI Atoms.
- Stop and wait for USER CONFIRMATION after finishing the audit/plan for a single page.

## 3. The 10/10 Compliance Checklist (The 4-Step Transformation)
For every file, you MUST verify and implement:
1. **Atomic UI Infusion**: Replace legacy tags with centralized atoms (`Button`, `SmartImage`, `Skeleton`).
2. **Logic Isolation**: 100% Logic moved to Hooks. Derived Data memoized. Section-level loading/error states.
3. **CSS Modularity**: 1:1 mapping. No Inline Styles (Rule #81). No Magic Values (Rule #30).
4. **Defensive Layer**: Services must sanitize data. Components must handle Empty/Error/Loading states.

## 4. Post-Refactor Reporting
Upon finishing a page, you MUST provide a "Completion Report" containing:
- List of ALL files scanned (Basenames).
- List of ALL files modified.
- Confirmation that Rule #81 (Inline Styles) and Rule #30 (Magic Values) are 100% resolved.
- Final Architecture Score (Target 10/10).
- Updated link to `PLATFORM_REPORT.md` and `PLATFORM_MASTER_PLAN.md`.
