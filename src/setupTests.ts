import '@testing-library/jest-dom';

declare global {
  interface JestMatchers<R> {
    toBeInTheDocument(): R;
  }
} 