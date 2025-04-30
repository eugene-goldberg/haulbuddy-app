import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedView } from '../components/ThemedView';
import { Text } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

// Mock the useThemeColor hook
jest.mock('../hooks/useThemeColor', () => ({
  useThemeColor: jest.fn((props, colorName) => {
    if (colorName === 'background') return '#ffffff';
    if (colorName === 'text') return '#000000';
    return '#cccccc';
  }),
}));

describe('ThemedView Component', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(
      <ThemedView testID="themed-view">
        <Text>Test Content</Text>
      </ThemedView>
    );
    
    const view = getByTestId('themed-view');
    expect(view).toBeTruthy();
    expect(view.props.style[0]).toMatchObject({ backgroundColor: '#ffffff' });
    expect(useThemeColor).toHaveBeenCalledWith({}, 'background');
  });
  
  it('applies custom styles', () => {
    const { getByTestId } = render(
      <ThemedView 
        testID="themed-view" 
        style={{ padding: 10, borderRadius: 8 }}
      >
        <Text>Test Content</Text>
      </ThemedView>
    );
    
    const view = getByTestId('themed-view');
    
    // Style should be an array with background color in first item and custom styles in second
    expect(view.props.style[0]).toMatchObject({ backgroundColor: '#ffffff' });
    expect(view.props.style[1]).toMatchObject({ padding: 10, borderRadius: 8 });
  });
  
  it('applies custom lightColor and darkColor', () => {
    // Clear previous mock calls
    (useThemeColor as jest.Mock).mockClear();
    
    // Set up mock to return a specific value for this test
    (useThemeColor as jest.Mock).mockImplementation((props, colorName) => {
      if (props.lightColor) return props.lightColor;
      return '#ffffff';
    });
    
    const { getByTestId } = render(
      <ThemedView 
        testID="themed-view" 
        light="#f5f5f5"
        dark="#333333"
      >
        <Text>Test Content</Text>
      </ThemedView>
    );
    
    const view = getByTestId('themed-view');
    
    // Check that the useThemeColor was called with the right props
    // In ThemedView component, it must be transforming lightColor to light and darkColor to dark
    expect(useThemeColor).toHaveBeenCalledWith(
      expect.objectContaining({ 
        light: '#f5f5f5', 
        dark: '#333333' 
      }), 
      'background'
    );
    
    // Check that the background color style is applied
    expect(view.props.style[0]).toMatchObject({ 
      backgroundColor: expect.any(String) 
    });
  });
});