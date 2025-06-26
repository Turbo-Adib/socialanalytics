# Claude Development Guidelines

## Implementation Best Practices

### Before Implementation
- Before implementing any feature, prompt the user to clarify any unclear requirements
- Use compound features and collaborate with the user through prompts
- Always prefer modern approaches and best practices
- Run `npm run lint` after making changes to ensure code quality
- Run `npx tsc --noEmit` to ensure type checking passes

### Code Organization
- Avoid classes where state is not required; prefer small, testable functions
- Always write unit tests for complex algorithms
- Prefer modern ES6+ syntax (arrow functions, destructuring, async/await)
- Prefer integration tests over excessive mocking
- Always test new API routes with integration tests
- Prefer end-to-end tests for critical user paths

### TypeScript Best Practices
- Prefer `type` over `interface` unless:
  - Interface merging is required
  - The interface is more readable for the specific use case
- Use branded types for IDs: `type ChannelId = string & { readonly __brand: unique symbol }`
- Always define explicit return types for functions
- Use strict TypeScript configuration
- Avoid `any` type; use `unknown` when type is truly unknown

### React & Component Guidelines
- Use functional components with hooks exclusively
- Follow naming conventions:
  - Components: PascalCase (e.g., `ChannelProfileCard`)
  - Props interfaces: ComponentNameProps (e.g., `ChannelProfileCardProps`)
  - Hooks: camelCase starting with 'use' (e.g., `useChannelData`)
- Keep components small and focused on a single responsibility
- Extract reusable logic into custom hooks
- Implement proper error boundaries for error handling
- Always include loading and error states in components

### State Management
- Use React Query (@tanstack/react-query) for server state
- Prefer local component state for UI state
- Use Context API sparingly, only for truly global state
- Avoid prop drilling by composing components properly

### Styling Guidelines
- Use Tailwind CSS for all styling
- Follow mobile-first responsive design
- Use Tailwind's dark mode classes (dark:) for theme support
- Avoid inline styles unless dynamically calculated
- Use clsx utility for conditional classes

### File Organization
```
src/
├── app/              # Next.js App Router pages
│   ├── api/         # API routes
│   └── (routes)/    # Page routes
├── components/       # React components
├── lib/             # External library configurations
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
├── hooks/           # Custom React hooks
└── config/          # Configuration files
```

## Writing Functions Best Practices

When evaluating function quality, use this checklist:

1. **Readability**: Can you easily follow what the function is doing?
2. **Complexity**: Does it have high cyclomatic complexity?
3. **Decomposition**: Can it be broken down into smaller, more focused functions?
4. **Parameters**: Are there any unused parameters?
5. **Magic Values**: Should any hardcoded values be parameters?
6. **Naming**: Is the function name clear and following conventions?
7. **Testability**: Can it be tested without extensive mocking?
8. **Alternative Names**: Consider 3 alternative names - is the current one best?

## Error Handling Best Practices

- Always handle errors gracefully with try-catch blocks
- Provide meaningful error messages to users
- Log errors with appropriate context for debugging
- Use proper HTTP status codes in API responses
- Implement retry mechanisms for transient failures
- Have fallback mechanisms for critical features
- Monitor error rates and patterns
- Use error boundaries in React components

## Security Best Practices

- Always validate and sanitize user inputs
- Use parameterized queries with Prisma to prevent SQL injection
- Implement proper authentication and authorization
- Use HTTPS for all external communications
- Store sensitive data encrypted (API keys in env variables)
- Implement rate limiting for API endpoints
- Never commit secrets to the repository
- Validate file uploads and limit file sizes

## Performance Best Practices

- Implement caching strategies where appropriate
- Use lazy loading for non-critical resources
- Optimize database queries and use indexes
- Implement pagination for large datasets
- Use CDN for static assets
- Minimize bundle sizes with code splitting
- Profile and monitor application performance
- Use compression for API responses

## Git Workflow

- Branch naming: `feature/*`, `fix/*`, `refactor/*`
- Commit messages: Follow conventional commits
  - `feat:` for new features
  - `fix:` for bug fixes
  - `refactor:` for code refactoring
  - `docs:` for documentation
  - `test:` for tests
  - `chore:` for maintenance
- Keep commits atomic and focused
- Write descriptive PR titles and descriptions
- Always review your own PR before requesting reviews

## Code Review Checklist

Before submitting code:
1. All tests pass
2. No TypeScript errors
3. Linting passes
4. Code follows project patterns
5. Complex logic is documented
6. Error cases are handled
7. Performance impact considered
8. Security implications reviewed

## Important Reminders

- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary
- ALWAYS prefer editing existing files to creating new ones
- NEVER proactively create documentation files unless explicitly requested
- Only use emojis if the user explicitly requests it