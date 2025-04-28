# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm start` - Start the Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm test` - Run all tests in watch mode
- `npm test -- -t "test name"` - Run specific test
- `npm run lint` - Run linter
- `npm run reset-project` - Reset project to initial state

## Code Style
- Uses TypeScript with strict mode enabled
- Path aliases: Use `@/` prefix for imports from project root
- Component structure: Functional components with React hooks
- Props: Define types with explicit interfaces/types
- Styling: Use StyleSheet.create() for styles
- Testing: Jest with snapshot testing
- Naming: PascalCase for components, camelCase for functions/variables
- Imports: Group by external libraries first, then internal modules
- Error handling: Prefer try/catch for async operations
- Theme handling: Use useThemeColor hook for theming