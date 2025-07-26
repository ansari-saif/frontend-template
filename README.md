# React + TypeScript + Vite Frontend Template

This template provides a modular React application setup using Vite, TypeScript, and modern best practices.

## Project Structure

The project follows a modular architecture pattern for better organization and scalability:

```
src/
├── modules/           # Feature modules
│   └── todo/         # Example module
│       ├── components/   # Module-specific components
│       ├── hooks/       # Custom hooks
│       ├── config.ts    # Module configuration
│       └── index.ts     # Module exports
├── types/            # TypeScript type definitions
├── components/       # Shared UI components
├── lib/             # Shared utilities
└── pages/           # Route pages
```

## Creating a New Module

Follow these steps to create a new feature module:

1. Create the module structure:
```bash
modules/
└── your-module/
    ├── components/     # Module-specific components
    ├── hooks/         # Custom hooks
    ├── config.ts      # Module configuration
    └── index.ts       # Public module exports
```

2. Define module types in `types/YourModule.ts`:
```typescript
export interface ModuleState {
  // State interfaces
}

export interface ModuleActions {
  // Action interfaces
}

export interface ComponentProps {
  // Component prop interfaces
}
```

3. Create a custom hook in `hooks/useYourModule.ts`:
```typescript
import { ModuleState, ModuleActions } from '@/types/YourModule';

export const useYourModule = (): ModuleState & ModuleActions => {
  // Implement module logic
  return {
    // Return state and actions
  };
};
```

4. Create module configuration in `config.ts`:
```typescript
export const MODULE_CONFIG = {
  // Module-specific constants and configuration
} as const;
```

5. Export module features in `index.ts`:
```typescript
export * from './components/YourComponent';
export * from './hooks/useYourModule';
export type * from '@/types/YourModule';
```

## Module Guidelines

1. **Encapsulation**
   - Keep module-specific code within the module directory
   - Only expose necessary components and hooks through index.ts
   - Use types to define clear interfaces

2. **State Management**
   - Use custom hooks for module-specific state and logic
   - Keep state close to where it's used
   - Share state through props or context when needed

3. **Component Organization**
   - Break down complex components into smaller ones
   - Keep components focused and single-purpose
   - Use composition over inheritance

4. **Type Safety**
   - Define clear interfaces for all components and hooks
   - Use TypeScript's strict mode
   - Export types through the module's index.ts

5. **Configuration**
   - Keep module-specific constants in config.ts
   - Use TypeScript's const assertions for better type inference
   - Document configuration options

## Example Usage

```typescript
// pages/YourPage.tsx
import { YourComponent, useYourModule } from '@/modules/your-module';

const YourPage: React.FC = () => {
  const { data, actions } = useYourModule();

  return <YourComponent data={data} {...actions} />;
};
```

## Development Tools

- [Vite](https://vitejs.dev/) - Build tool and dev server
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting

## ESLint Configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
