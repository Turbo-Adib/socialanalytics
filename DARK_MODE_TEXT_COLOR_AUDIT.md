# Dark Mode Text Color Audit

## Summary
Found 157 instances of text color classes without corresponding dark mode variants across the codebase. These need to be fixed to ensure proper dark mode support.

## Files Requiring Updates

### High Priority (Most Issues)

#### 1. `src/components/NicheAdmin.tsx` (22 issues)
- Multiple instances of `text-gray-900`, `text-gray-600`, `text-gray-500`, `text-gray-700`, `text-gray-400`
- Background colors like `bg-gray-50` without dark variants
- Hover states using `hover:text-gray-700` without dark variants

#### 2. `src/components/RevenueTransparency.tsx` (21 issues)
- `text-gray-600`, `text-gray-900`, `text-gray-500`, `text-gray-700`
- Missing dark mode variants for various UI elements

#### 3. `src/components/DataQualityIndicator.tsx` (17 issues)
- Multiple gray text colors without dark mode support

### Medium Priority

#### 4. `src/components/IntelligentInsights.tsx` (3 issues)
- Gray text colors needing dark mode variants

#### 5. `src/components/TimeframeToggle.tsx` (2 issues)
- Gray text colors needing dark mode variants

### Low Priority

#### 6. `src/components/OutlierAnalyzer.tsx` (1 issue)
- `text-black` without dark mode variant

#### 7. `src/components/DesignSystemShowcase.tsx` (1 issue)
- Gray text color without dark mode variant

## Common Patterns to Fix

### 1. Gray Text Colors
Replace:
```tsx
className="text-gray-900"
className="text-gray-600"
className="text-gray-500"
className="text-gray-700"
className="text-gray-400"
```

With:
```tsx
className="text-gray-900 dark:text-gray-100"
className="text-gray-600 dark:text-gray-400"
className="text-gray-500 dark:text-gray-500"
className="text-gray-700 dark:text-gray-300"
className="text-gray-400 dark:text-gray-600"
```

### 2. Black Text
Replace:
```tsx
className="text-black"
```

With:
```tsx
className="text-black dark:text-white"
```

### 3. Background Colors
Replace:
```tsx
className="bg-gray-50"
className="bg-gray-100"
```

With:
```tsx
className="bg-gray-50 dark:bg-gray-900"
className="bg-gray-100 dark:bg-gray-800"
```

### 4. Hover States
Replace:
```tsx
className="hover:text-gray-700"
className="hover:text-gray-600"
```

With:
```tsx
className="hover:text-gray-700 dark:hover:text-gray-300"
className="hover:text-gray-600 dark:hover:text-gray-400"
```

## Other Color Classes Found

While searching, also found instances of colored text (blue, green, yellow, etc.) that might benefit from dark mode variants:
- Blue colors: `text-blue-600`, `text-blue-900`, etc.
- Green colors: `text-green-600`, `text-green-900`, etc.
- Yellow colors: `text-yellow-600`, `text-yellow-800`, etc.
- Purple colors: `text-purple-600`, `text-purple-900`, etc.

These colored texts might need adjusted shades in dark mode for better contrast.

## Recommended Action Plan

1. **Start with high-priority files** (NicheAdmin.tsx, RevenueTransparency.tsx, DataQualityIndicator.tsx)
2. **Use consistent patterns** for dark mode variants
3. **Test each component** in both light and dark modes after changes
4. **Consider creating utility classes** for commonly used color combinations
5. **Review colored text** (blue, green, etc.) for appropriate dark mode shades

## Next Steps

1. Fix text colors in priority order
2. Test components in dark mode
3. Review and adjust colored text for optimal contrast
4. Consider implementing a design system with predefined dark mode colors