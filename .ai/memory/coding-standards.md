# Coding Standards

- Prefer simple, readable code over clever solutions
- Validate inputs at system boundaries (API DTOs, form submissions)
- Write small, focused functions that do one thing
- Avoid overengineering — solve the problem in front of you
- Use clear, descriptive names for variables, functions, and files
- Keep files short — split when a file has multiple responsibilities
- Handle errors explicitly, don't swallow them silently
- No dead code — delete what isn't used
- Use shared types from `@ally-waste/shared-types` — never redefine domain types locally
- TanStack Query for server state, Zustand for client state, React Context for cross-cutting concerns
- Custom hooks to encapsulate domain logic and keep components clean
- Bootstrap utility classes for styling — minimal custom CSS
- Ally Waste brand colors: Navy `#101A30`, Green `#7EB141`, Accent `#00D084`
