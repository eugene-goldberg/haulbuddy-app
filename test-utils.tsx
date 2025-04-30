import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { AuthContextProvider } from './__mocks__/authContext';
import { BookingContextProvider } from './__mocks__/bookingContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Create a custom renderer that includes all providers
const AllTheProviders: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <SafeAreaProvider>
      <AuthContextProvider>
        <BookingContextProvider>
          {children}
        </BookingContextProvider>
      </AuthContextProvider>
    </SafeAreaProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react-native';

// Override render method
export { customRender as render };