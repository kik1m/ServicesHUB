---
trigger: always_on
---

### **Project Rule: ServicesHUB Scalability & Refactoring Roadmap**

**Goal**: Transform ServicesHUB into a professional, scalable, and high-performance platform across all 28 pages while maintaining the current visual design 100%.

#### **1. Core Architectural Principles (MANDATORY)**
*   **Logic Isolation**: No direct database fetching inside UI components. All logic must reside in **Custom Hooks** (e.g., `src/hooks/use[PageName]Data.js`).
*   **Service Layer**: All Supabase queries must be centralized in `src/services/` (e.g., `toolsService.js`, `categoriesService.js`). Use a "Base Query" pattern to reduce redundancy.
*   **Component-Level Styling**: Transition from global CSS to **CSS Modules**. Each component must have its own `.module.css` file (e.g., `HomeHero.module.css`).
*   **Performance First**: Use `Promise.all` for parallel data fetching. Gradually implement `React Query` for global state management and caching.

#### **2. Execution Strategy (Iterative Approach)**
*   **Phased Rollout**: Do NOT refactor all 28 pages at once. Follow this priority:
    1.  **Phase A (High Impact)**: Home, ToolDetail, Search, CategoryDetail, Profile.
    2.  **Phase B (Functional)**: SubmitTool, Blog, Auth, Dashboard.
    3.  **Phase C (Static/Secondary)**: About, Legal, Settings.
*   **Component-Driven Migration**: For each page, identify shared components (like `ToolCard`) and refactor them once to benefit all pages simultaneously.

#### **3. Step-by-Step Refactoring Workflow (Per Page/Component)**
1.  **Refactor Logic**: Move all `useState` and `useEffect` fetching logic to a dedicated Custom Hook.
2.  **Refactor API**: Move raw Supabase queries to the corresponding Service file.
3.  **Refactor Style**: Create a `.module.css` file, move relevant styles from global CSS, and update the component imports. **Visual parity must be 100%.**
4.  **Enhance UX**: Add clear CTAs, Social Proof elements, and improve loading states (Spinners/Skeletons).

#### **4. Safety & Quality Control**
*   **No Stealth Changes**: Never modify visual design, colors, or layouts without explicit user approval.
*   **Zero Breaking Changes**: Ensure existing functionality works perfectly before moving to the next component.
*   **Documentation**: Maintain an active `task.md` to track progress through the 28 pages and 150+ components.
