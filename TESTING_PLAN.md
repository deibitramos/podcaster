# Testing Infrastructure Plan - Podcaster App

## Executive Summary

This document outlines a comprehensive plan for adding unit and integration tests to the Podcaster application. The testing infrastructure will use **Vitest**, **React Testing Library**, and **MSW (Mock Service Worker)** as the core technologies, following modern React testing best practices.

## Current State Analysis

### Technology Stack
- **React 19** with TypeScript
- **Zustand** for client state management
- **TanStack Query** for server state management
- **TanStack Router** for routing
- **Vite** as build tool
- **Axios** for HTTP requests
- **No existing test infrastructure**

### Project Structure
```
src/
├── api/              # API layer with TanStack Query
├── components/       # React components
├── entities/         # Type definitions
├── lib/             # Utility functions
├── routes/          # Route components
└── store/           # Zustand store (player & search slices)
```

### Key Areas to Test
1. **Zustand Store** - Player state and search filtering
2. **API Layer** - Podcast and episode fetching
3. **Components** - UI and feature components
4. **Utility Functions** - Date formatting, error handling, iTunes data transformation
5. **Custom Hooks** - useDebounce, useTrack, etc.

---

## Testing Philosophy

### Integration Tests Over Unit Tests
Following official Redux (and state management) best practices, we will:
- **Prefer integration tests** for components connected to Zustand store
- Test user workflows rather than implementation details
- Mock external dependencies (API calls) but not internal state management
- Focus on behavior, not implementation

### Testing Pyramid
```
        /\
       /E2\     ← Few (not in initial scope)
      /----\
     / Intg \   ← Many (components + state)
    /--------\
   /   Unit   \ ← Some (utils, hooks)
  /------------\
```

---

## Proposed Testing Stack

### Core Dependencies

#### Test Runner & Framework
```json
{
  "vitest": "^2.1.0",
  "@vitest/ui": "^2.1.0",
  "jsdom": "^25.0.0"
}
```

#### Testing Libraries
```json
{
  "@testing-library/react": "^16.1.0",
  "@testing-library/jest-dom": "^6.6.0",
  "@testing-library/user-event": "^14.5.0"
}
```

#### API Mocking
```json
{
  "msw": "^2.7.0"
}
```

#### Type Support
```json
{
  "@types/jest": "^29.5.0"
}
```

### Why These Tools?

#### Vitest
- **Native Vite integration** - Uses same config and transform pipeline
- **Fast** - Uses Vite's transformation pipeline
- **Compatible** - Jest-compatible API, easy migration
- **Modern** - ESM support, TypeScript out of the box
- **Built-in coverage** - via c8

#### React Testing Library
- **Industry standard** for React testing
- **Encourages best practices** - Test behavior, not implementation
- **Accessibility-focused** - Uses semantic queries
- **Well-documented** - Extensive community resources

#### MSW (Mock Service Worker)
- **Intercepts network requests** at the network layer
- **Works in tests and browser** - Same mocks for dev and test
- **Type-safe** - TypeScript support
- **Realistic** - Mocks actual HTTP requests, not axios/fetch

---

## Configuration Files

### 1. `vitest.config.ts`
```typescript
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/test/',
          '**/*.d.ts',
          '**/*.config.*',
          '**/mockData',
          'src/main.tsx',
        ],
      },
    },
  })
);
```

### 2. `src/test/setup.ts`
Global test setup file:
```typescript
import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { server } from './mocks/server';

// MSW server setup
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock HTMLMediaElement (for audio player tests)
window.HTMLMediaElement.prototype.load = vi.fn();
window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
window.HTMLMediaElement.prototype.pause = vi.fn();
```

### 3. `src/test/utils.tsx`
Custom render utilities:
```typescript
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a custom render that includes providers
export function renderWithProviders(
  ui: ReactElement,
  {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    }),
    ...renderOptions
  }: RenderOptions & { queryClient?: QueryClient } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
}

export * from '@testing-library/react';
export { renderWithProviders as render };
```

### 4. `src/test/mocks/handlers.ts`
MSW request handlers:
```typescript
import { http, HttpResponse } from 'msw';
import { mockPodcasts, mockEpisodes } from './data';

export const handlers = [
  // Search podcasts
  http.get('/itunes/search', ({ request }) => {
    const url = new URL(request.url);
    const term = url.searchParams.get('term');
    
    if (!term) {
      return HttpResponse.json({ results: [] });
    }
    
    return HttpResponse.json({
      resultCount: mockPodcasts.length,
      results: mockPodcasts,
    });
  }),

  // Lookup episodes
  http.get('/itunes/lookup', ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return HttpResponse.json({ results: [] });
    }
    
    return HttpResponse.json({
      resultCount: mockEpisodes.length + 1,
      results: [mockPodcasts[0], ...mockEpisodes],
    });
  }),
];
```

### 5. `src/test/mocks/server.ts`
MSW server setup:
```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

### 6. `src/test/mocks/data/podcasts.ts` & `episodes.ts`
Mock data fixtures matching iTunes API format.

---

## Test Structure

### Directory Structure
```
src/
├── test/
│   ├── setup.ts                    # Global test setup
│   ├── utils.tsx                   # Custom render with providers
│   ├── mocks/
│   │   ├── handlers.ts             # MSW request handlers
│   │   ├── server.ts               # MSW server instance
│   │   └── data/                   # Mock data
│   │       ├── podcasts.ts         # Sample podcast data
│   │       └── episodes.ts         # Sample episode data
│   └── factories/                  # Test data factories (optional)
│
├── lib/
│   ├── dates.test.ts               # Unit tests for date utilities
│   ├── itunes.test.ts              # Unit tests for data transformers
│   ├── errors.test.ts              # Unit tests for error handling
│   └── useDebounce.test.ts         # Unit tests for custom hook
│
├── store/
│   ├── player/
│   │   ├── actions.test.ts         # Unit tests for player actions
│   │   ├── utils.test.ts           # Unit tests for player utilities
│   │   └── selectors.test.ts       # Unit tests for selectors
│   └── createSearchSlice.test.ts   # Unit tests for search slice
│
├── components/
│   ├── SearchBar.test.tsx          # Integration test (Zustand)
│   ├── DataTable.test.tsx          # Integration test
│   ├── Header.test.tsx             # Unit test (presentational)
│   ├── Footer.test.tsx             # Unit test (presentational)
│   └── player/
│       ├── Player.test.tsx         # Integration test (Zustand + audio)
│       ├── Controls.test.tsx       # Integration test (Zustand)
│       ├── PlayButton.test.tsx     # Integration test
│       └── hooks/
│           └── useTrack.test.ts    # Unit test for custom hook
│
└── routes/
    └── (home)/
        └── index.test.tsx           # Integration test (Query + Zustand)
```

---

## Testing Patterns & Examples

### 1. Testing Utility Functions (Unit Tests)

**Example: `src/lib/dates.test.ts`**
```typescript
import { describe, it, expect } from 'vitest';
import { formatDuration, formatDate } from './dates';

describe('formatDuration', () => {
  it('formats seconds correctly', () => {
    expect(formatDuration(90)).toBe('1:30');
  });

  it('formats hours correctly', () => {
    expect(formatDuration(3665)).toBe('1:01:05');
  });

  it('handles zero', () => {
    expect(formatDuration(0)).toBe('0:00');
  });
});
```

### 2. Testing Zustand Store (Unit Tests)

**Example: `src/store/player/actions.test.ts`**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../index';
import { act, renderHook } from '@testing-library/react';

describe('Player Actions', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useAppStore());
    act(() => {
      result.current.stop();
    });
  });

  it('should play episode', () => {
    const { result } = renderHook(() => useAppStore());
    
    act(() => {
      result.current.play();
    });
    
    expect(result.current.playState).toBe('PLAYING');
  });

  it('should pause episode', () => {
    const { result } = renderHook(() => useAppStore());
    
    act(() => {
      result.current.play();
      result.current.pause();
    });
    
    expect(result.current.playState).toBe('PAUSED');
  });
});
```

### 3. Testing Components with Zustand (Integration Tests)

**Example: `src/components/SearchBar.test.tsx`**
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';
import { useAppStore } from '@/store';

describe('SearchBar', () => {
  it('renders with placeholder', () => {
    const { setFilter, filter } = useAppStore.getState();
    render(
      <SearchBar 
        filter={filter} 
        setFilter={setFilter} 
        placeholder="Search podcasts" 
      />
    );
    
    expect(screen.getByPlaceholderText('Search podcasts')).toBeInTheDocument();
  });

  it('updates filter on input change', async () => {
    const user = userEvent.setup();
    const setFilter = vi.fn();
    
    render(
      <SearchBar filter="" setFilter={setFilter} />
    );
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'javascript');
    
    expect(setFilter).toHaveBeenCalledWith('javascript');
  });
});
```

### 4. Testing Components with TanStack Query (Integration Tests)

**Example: `src/routes/(home)/index.test.tsx`**
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import HomePage from './index';

describe('HomePage', () => {
  it('displays podcasts after search', async () => {
    render(<HomePage />);
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    await userEvent.type(searchInput, 'javascript');
    
    await waitFor(() => {
      expect(screen.getByText('JavaScript Podcast')).toBeInTheDocument();
    });
  });

  it('displays loading state', async () => {
    render(<HomePage />);
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    await userEvent.type(searchInput, 'javascript');
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays error state on API failure', async () => {
    server.use(
      http.get('/itunes/search', () => {
        return HttpResponse.json(
          { error: 'Server error' },
          { status: 500 }
        );
      })
    );

    render(<HomePage />);
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    await userEvent.type(searchInput, 'javascript');
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

### 5. Testing Audio Player (Integration Tests)

**Example: `src/components/player/Player.test.tsx`**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import Player from './Player';
import { useAppStore } from '@/store';

describe('Player', () => {
  it('does not render when no track requested', () => {
    render(<Player />);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('renders when track is requested', async () => {
    const { result } = renderHook(() => useAppStore());
    
    act(() => {
      result.current.playPodcastEpisode(123, 456);
    });
    
    render(<Player />);
    
    await waitFor(() => {
      expect(screen.getByRole('region')).toBeInTheDocument();
    });
  });

  it('plays and pauses audio', async () => {
    const user = userEvent.setup();
    const mockPlay = vi.fn().mockResolvedValue(undefined);
    const mockPause = vi.fn();
    
    HTMLMediaElement.prototype.play = mockPlay;
    HTMLMediaElement.prototype.pause = mockPause;
    
    const { result } = renderHook(() => useAppStore());
    act(() => {
      result.current.playPodcastEpisode(123, 456);
    });
    
    render(<Player />);
    
    const playButton = await screen.findByRole('button', { name: /play/i });
    await user.click(playButton);
    
    expect(mockPlay).toHaveBeenCalled();
    
    const pauseButton = await screen.findByRole('button', { name: /pause/i });
    await user.click(pauseButton);
    
    expect(mockPause).toHaveBeenCalled();
  });
});
```

---

## Package.json Updates

### Scripts to Add
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest --coverage"
  }
}
```

### Dependencies to Add
```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/jest": "^29.5.0",
    "@vitest/coverage-v8": "^2.1.0",
    "@vitest/ui": "^2.1.0",
    "jsdom": "^25.0.0",
    "msw": "^2.7.0",
    "vitest": "^2.1.0"
  }
}
```

---

## Testing Coverage Goals

### Target Coverage
- **Overall**: 80%+ code coverage
- **Utilities**: 90%+ (pure functions, easy to test)
- **Store**: 85%+ (business logic)
- **Components**: 75%+ (integration tests)
- **Hooks**: 85%+ (custom hooks)

### Coverage Exclusions
- Config files (`*.config.ts`)
- Type definitions (`*.d.ts`)
- Main entry point (`main.tsx`)
- Test files themselves
- Generated files (`routeTree.gen.ts`)

---

## Testing Best Practices

### DO's ✅
- **Test user behavior**, not implementation details
- **Use semantic queries** (getByRole, getByLabelText, getByText)
- **Mock external dependencies** (APIs with MSW)
- **Write descriptive test names** that explain the scenario
- **Use `userEvent`** over `fireEvent` for realistic interactions
- **Clean up after tests** (automatic with React Testing Library)
- **Test error states** and edge cases
- **Keep tests simple and focused** (one concept per test)

### DON'Ts ❌
- **Don't test implementation details** (internal state, props)
- **Don't use shallow rendering** (not supported in React Testing Library)
- **Don't test third-party libraries** (assume they work)
- **Don't mock Zustand store** in integration tests
- **Don't create tightly coupled tests** (test isolation)
- **Don't forget to wait for async operations** (use waitFor)

---

## Migration & Adoption Strategy

### Phase 1: Infrastructure (Week 1)
1. Install all dependencies
2. Create configuration files
3. Set up MSW with mock data
4. Create test utilities
5. Add npm scripts
6. Update documentation

### Phase 2: Utility & Store Tests (Week 2)
1. Test pure utility functions (lib/)
2. Test Zustand store actions and selectors
3. Test custom hooks
4. Achieve 85%+ coverage on utilities

### Phase 3: Component Tests (Week 3-4)
1. Test presentational components (Header, Footer, UI)
2. Test integrated components (SearchBar, DataTable)
3. Test Player components
4. Test route components
5. Achieve 75%+ coverage on components

### Phase 4: Documentation & CI (Week 5)
1. Document testing patterns in README
2. Add coverage badges
3. Set up CI/CD to run tests
4. Enforce coverage thresholds
5. Train team on testing practices

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test:run
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v4
        with:
          files: ./coverage/coverage-final.json
```

---

## Resources & References

### Official Documentation
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [MSW](https://mswjs.io/)
- [Zustand Testing](https://docs.pmnd.rs/zustand/guides/testing)
- [TanStack Query Testing](https://tanstack.com/query/latest/docs/framework/react/guides/testing)

### Best Practices
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details)
- [Effective Snapshot Testing](https://kentcdodds.com/blog/effective-snapshot-testing)

---

## Testing Decisions

### Confirmed Decisions
1. **Coverage thresholds**: Target 80% overall, 90% utilities, 75% components ✅
2. **Snapshot tests**: Not using snapshot testing ✅
3. **E2E tests**: Not needed for this project ✅
4. **Visual regression**: Not needed for this project ✅
5. **Accessibility testing**: Not a priority for this project ✅

### Risks & Mitigations
- **Risk**: Tests slow down development
  - **Mitigation**: Use watch mode, write fast tests, mock appropriately
- **Risk**: False positives in CI
  - **Mitigation**: Proper async handling, stable selectors
- **Risk**: Maintenance overhead
  - **Mitigation**: Focus on behavior, not implementation

---

## Conclusion

This plan provides a comprehensive, modern approach to testing the Podcaster application. By following React testing best practices and using industry-standard tools, we'll create a robust test suite that:

- **Increases confidence** in refactoring and new features
- **Documents** component behavior and expected use
- **Catches bugs** early in the development process
- **Improves code quality** through testable design
- **Enables CI/CD** with automated testing

**Next Step**: ✅ Plan approved - proceeding with Phase 1 implementation.
