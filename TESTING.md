# Testing Guide for Navigation Example App

This document provides details on how to run and extend the test suite for the Navigation Example app. The test framework allows for running end-to-end tests without requiring an Android emulator or iOS simulator.

## Test Structure

The test suite is divided into several categories:

1. **Unit Tests** - Located in `__tests__/` directory, testing individual components in isolation
2. **End-to-End Tests** - Located in `__e2e__/` directory, testing complete user flows
3. **Simplified End-to-End Tests** - Located in `__e2e__/` directory with the prefix `Simple`, providing stripped-down versions of components for focused testing
4. **Snapshot Tests** - Also in `__tests__/` directory with `.snap` files in `__snapshots__/`

## Running Tests

The project includes several npm scripts for running tests:

> **Note:** Due to dependencies on Firebase and other external services, it's recommended to use the simplified tests when working without emulators.

```bash
# Run all tests with watch mode (updates as you change files)
npm test

# Run only end-to-end tests
npm run test:e2e

# Run only simplified end-to-end tests (recommended for environments without emulators)
npm run test:simple

# Run only unit tests
npm run test:unit

# Run all tests once without watch mode
npm run test:all

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (good for continuous integration environments)
npm run test:ci

# Run tests in watch mode for specific files
npm run test:watch
```

## Test Files

### End-to-End Tests

- `__e2e__/OnboardingFlow.test.tsx` - Tests user authentication flows (login and signup)
- `__e2e__/BookingFlow.test.tsx` - Tests the complete booking process
- `__e2e__/CustomerDashboard.test.tsx` - Tests customer dashboard functionality

### Simplified End-to-End Tests

- `__e2e__/SimpleLoginFlow.test.tsx` - Tests login flow using simplified components
- `__e2e__/SimpleBookingFlow.test.tsx` - Tests booking confirmation and navigation to dashboard
- `__e2e__/SimpleDashboard.test.tsx` - Tests dashboard functionality with simplified components

### Unit Tests

- `__tests__/ThemedText-test.tsx` - Example unit test for the ThemedText component

## Test Utilities

The test suite uses several utility files:

- `jest-setup.js` - Sets up global mocks and configuration for the test environment
- `__e2e__/test-utils.tsx` - Provides custom render methods with all required context providers
- `__mocks__/` - Contains mock implementations of various modules

## Writing New Tests

### Adding a Unit Test

1. Create a new file in the `__tests__/` directory with the naming convention `ComponentName.test.tsx`
2. Import the component and necessary test utilities
3. Write your test cases using Jest and React Testing Library

Example:

```typescript
import React from 'react';
import { render } from '@testing-library/react-native';
import { MyComponent } from '../components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MyComponent title="Test" />);
    expect(getByText('Test')).toBeTruthy();
  });
});
```

### Adding an End-to-End Test

1. Create a new file in the `__e2e__/` directory with the naming convention `FeatureName.test.tsx`
2. Import the screens and custom render method from test utilities
3. Write your test cases using Jest and React Testing Library

Example:

```typescript
import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { render } from './test-utils';
import ScreenOne from '../app/feature/ScreenOne';
import ScreenTwo from '../app/feature/ScreenTwo';
import { router } from 'expo-router';

describe('My Feature Flow', () => {
  it('navigates from screen one to screen two', async () => {
    const { getByText } = render(<ScreenOne />);
    
    // Interact with the UI
    fireEvent.press(getByText('Next'));
    
    // Verify navigation
    expect(router.push).toHaveBeenCalledWith('/feature/screen-two');
  });
});
```

## Mocking

To mock external dependencies or context providers for your tests:

1. Add the mock implementation to `jest-setup.js` for global mocks
2. Use the `customRender` function with context overrides for component-specific mocks

Example:

```typescript
const { getByText } = render(
  <MyComponent />,
  {
    customAuthContext: {
      isAuthenticated: true,
      user: { id: 'mock-user', name: 'Mock User' }
    }
  }
);
```

## Troubleshooting

If you encounter issues with tests:

1. Check the `jest-setup.js` file to ensure all necessary modules are mocked
2. Verify that your component's dependencies are properly mocked
3. For specific module errors, add the mock implementation to `jest-setup.js`
4. Use `console.log` within tests to debug issues (these logs appear in the test output)

### Firebase Dependencies

When working with components that have Firebase dependencies:

1. Use the simplified test components when possible to avoid Firebase initialization issues
2. Run `npx jest __e2e__/Simple` to run only the simplified tests that don't require Firebase
3. For full component tests, ensure proper Firebase mocking in `__mocks__/firebase.js` and `__mocks__/firebaseMock.js`

## Best Practices

1. Keep tests focused on a single feature or component
2. Use descriptive test names that explain what functionality is being tested
3. Test both success and failure cases
4. Mock external dependencies rather than relying on actual API calls
5. Use the React Testing Library's queries in this preferred order:
   - getByRole (most accessible)
   - getByLabelText
   - getByPlaceholderText
   - getByText
   - getByDisplayValue
   - getByAltText
   - getByTitle
   - getByTestId (least accessible)