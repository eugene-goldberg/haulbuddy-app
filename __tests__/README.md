# Firebase Testing in NavigationExample

This directory contains tests for Firebase functionality in the NavigationExample project.

## Overview

We have created several test files to demonstrate testing Firebase interaction:

1. **simple-firebase.test.ts** - A simple test demonstrating how to mock and test Firebase auth and Firestore
2. **auth-service-simple.test.ts** - Tests for the auth service functions
3. **booking-service-simple.test.ts** - Tests for the booking service functions
4. **firestore-service.test.ts** - Tests for the Firestore service functions
5. **booking-service.test.ts** - Tests for booking service with more complex mocks
6. **auth-service.test.ts** - Tests for authentication service with detailed mocks
7. **AuthContext.test.tsx** - Tests for the AuthContext provider component
8. **FirebaseAuthIntegration.test.tsx** - Integration tests for Firebase authentication
9. **FirestoreBookingIntegration.test.tsx** - Integration tests for Firestore booking functionality

## Mock Strategy

The test files follow the naming convention specified in package.json:

```json
"moduleNameMapper": {
  "^firebase/(.*)$": "<rootDir>/__mocks__/firebaseMock.js",
  "^../firebase$": "<rootDir>/__mocks__/firebase.js",
  "^../../firebase$": "<rootDir>/__mocks__/firebase.js"
}
```

This mapping is used by Jest to redirect Firebase imports to our mock implementations.

## Running Tests

You can run specific test files using npm scripts:

```bash
# Run all tests
npm test

# Run only unit tests (in __tests__ directory)
npm run test:unit

# Run specific test file by pattern
npm test -- -t "Simple Firebase Mocking"
```

## Best Practices

When writing Firebase tests:

1. Use the pattern demonstrated in `simple-firebase.test.ts` and `auth-service-simple.test.ts`
2. Mock Firebase methods directly in the test, configuring them for each specific test case
3. Clear mocks between tests with `jest.clearAllMocks()`
4. Test both success and error scenarios
5. For detailed guidance, see TESTING-README.md

## Current Status

The tests demonstrate the pattern to follow for Firebase testing, but they still have some mocking issues to resolve. These can be addressed by:

1. Ensuring the mock implementations in `__mocks__` directory are properly exported and accessible
2. Using the `require` pattern rather than importing modules at the top level
3. Making sure the mocks are configured before they are used

See TESTING-README.md for detailed debugging tips.