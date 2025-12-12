/**
 * Adds helpful DOM testing matchers like .toBeInTheDocument() and .toHaveAttribute()
 */
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * Automatically removes rendered components after each test to prevent interference
 */
afterEach(() => {
  cleanup();
});

/**
 * Mocks the browser's window.matchMedia API (for responsive design checks)
 * since it doesn't exist in the jsdom test environment
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, 
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});
