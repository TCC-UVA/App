# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native financial app built with Expo, using file-based routing via expo-router. The app uses TypeScript with strict type checking enabled and follows an MVVM (Model-View-ViewModel) architecture pattern.

## Development Commands

### Core Commands
- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests in watch mode

### Testing
- Run all tests: `npm test`
- Run tests without watch mode: `npx jest`
- Test a specific file: `npx jest path/to/file.spec.ts`
- The test setup uses jest-expo preset with React Native Testing Library

## Architecture

### MVVM Pattern
The application strictly follows the MVVM pattern for screens:
- **Model** (`model.ts`): Defines validation schemas (using Yup) and TypeScript types
- **ViewModel** (`viewModel.ts`): Contains business logic, form handling (react-hook-form), and navigation. Accepts service dependencies via dependency injection
- **View** (`view.tsx`): Pure presentational component that receives all props from ViewModel
- **Index** (`index.tsx`): Composition layer that instantiates services and connects ViewModel to View

Example structure in `src/app/(signed-off)/login/`:
```
login/
├── index.tsx          # Composition (instantiates AuthService, connects ViewModel to View)
├── model.ts           # Schema and types
├── viewModel.ts       # Business logic (useLoginViewModel)
├── view.tsx           # Presentation (LoginView)
└── __tests__/         # Tests for ViewModel and View
```

### Directory Structure
- `src/app/` - Expo Router screens and routes (file-based routing)
  - `(signed-off)/` - Unauthenticated screens group (login, register)
  - `_layout.tsx` - Root layout with providers
- `src/services/` - API services and data access layer
  - `api/` - Axios instance configuration (baseURL: http://localhost:3000)
  - `auth/` - Authentication service interface and HTTP implementation
  - `mutations/` - React Query mutation hooks (useLoginMutation, useRegisterMutation)
- `src/components/` - Reusable UI components
  - `controlled-Input/` - Form input wrapper for react-hook-form
  - `layout/` - Layout components
- `src/config/` - Configuration files (Tamagui theme)
- `src/di/` - Dependency injection container (simple factory-based DI)
- `src/mock/` - Test utilities and providers for Jest tests

### Key Technologies
- **UI**: Tamagui for design system and styling
- **Forms**: react-hook-form with Yup validation via @hookform/resolvers
- **Data Fetching**: @tanstack/react-query for async state management
- **Navigation**: expo-router (file-based routing)
- **Animation**: react-native-reanimated
- **Testing**: Jest + React Native Testing Library

## Dependency Injection

The app uses a custom DI container in `src/di/index.ts`. Services should be:
1. Defined as interfaces (e.g., `AuthService`)
2. Implemented as classes (e.g., `AuthServiceHttp`)
3. Injected into ViewModels as parameters
4. Instantiated in the index file composition layer

## Testing Guidelines

### Test Setup
- Tests are co-located with features in `__tests__/` directories
- Use `createWrapper()` from `src/mock/provider.tsx` for hooks that need React Query
- Use `WrapperUi` for component tests that need full provider tree (QueryClient, Tamagui, SafeArea)
- Mock `expo-router` hooks like `useRouter` when testing navigation

### Testing ViewModels
- Create fake service implementations with Jest mocks
- Test business logic, form submission, loading states, and navigation
- Use `renderHook` from React Native Testing Library
- Always wrap with `createWrapper()` for React Query context

### Testing Views
- Test presentational logic and user interactions
- Mock ViewModel return values as needed
- Use `WrapperUi` for full provider context

## Path Aliases

The project uses `@/` as an alias for the root directory:
```typescript
import { ControlledInput } from "@/src/components/controlled-Input";
import { AuthService } from "@/src/services/auth";
```

## API Configuration

The axios API client is configured in `src/services/api/index.ts` with baseURL `http://localhost:3000`. Update this for different environments.

## Routing Convention

Expo Router uses file-based routing:
- Files in `src/app/` become routes automatically
- Groups like `(signed-off)` don't affect URL structure but help organize screens
- `_layout.tsx` files define layout hierarchies and provider nesting
