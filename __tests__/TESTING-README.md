# Firebase Testing Guide

This document provides guidance on how to test Firebase functionality in this project.

## Setup

We use Jest for testing and mock Firebase modules to avoid making actual Firebase calls during tests. The mocking strategy is defined in the package.json `jest` configuration:

```json
"moduleNameMapper": {
  "^firebase/(.*)$": "<rootDir>/__mocks__/firebaseMock.js",
  "^../firebase$": "<rootDir>/__mocks__/firebase.js",
  "^../../firebase$": "<rootDir>/__mocks__/firebase.js"
}
```

## Mock Files

- `__mocks__/firebase.js`: Mocks the entire firebase.js module
- `__mocks__/firebaseMock.js`: Generic Firebase mock for all Firebase modules
- `__mocks__/authContext.tsx`: Mock for the AuthContext
- `__mocks__/bookingContext.tsx`: Mock for the BookingContext

## Writing Firebase Tests

### Testing Authentication

Use the mock objects to test authentication flows without making actual Firebase auth calls.

```typescript
// Example authentication test
test('login successfully authenticates a user', async () => {
  const { signInWithEmailAndPassword } = require('firebase/auth');
  signInWithEmailAndPassword.mockResolvedValueOnce({ 
    user: { uid: 'test-uid', email: 'test@example.com' } 
  });
  
  // Test your authentication flow
});
```

### Testing Firestore

Test Firestore operations by configuring the mock objects to return specific data.

```typescript
// Example Firestore test
test('getBooking retrieves booking data', async () => {
  const { getDoc } = require('firebase/firestore');
  getDoc.mockResolvedValueOnce({
    exists: () => true,
    data: () => ({
      id: 'booking-123',
      customerId: 'user-123',
      // Other booking properties
    })
  });
  
  // Test your Firestore operation
});
```

## Best Practices

1. Always clear mocks between tests with `jest.clearAllMocks()`
2. Mock only what you need for each test
3. Verify both success and error scenarios
4. Test that your components handle loading states correctly

## Debugging Tips

If you're having issues with the mocks:

1. Check that you're importing Firebase modules correctly
2. Make sure mocks are defined before importing the modules
3. Use `console.log(jest.isMockFunction(functionName))` to verify mocking
4. Check mock implementation with `console.log(functionName.mock.calls)`
