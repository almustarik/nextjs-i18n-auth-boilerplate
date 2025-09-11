import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Flattens keys like `filters[something]=x` into { something: 'x' }.
 * Leaves other keys (offset, limit, search, sort, etc.) as-is.
 * Pass in a plain object, e.g. Object.fromEntries(searchParams.entries()).
 */
export function createQueryParams(
  filters?: Record<string, any>
): Record<string, any> {
  const params: Record<string, any> = {};
  if (!filters) return params;

  for (const key in filters) {
    if (!Object.prototype.hasOwnProperty.call(filters, key)) continue;

    const value = filters[key];
    // Matches "filters[someKey]" -> groups: ["filters[someKey]", "filters", "someKey"]
    const match = key.match(/^(\w+)\[(\w+)\]$/);

    if (match && match[1] === 'filters') {
      const nestedKey = match[2];
      params[nestedKey] = value; // Flatten nested filter into top-level
    } else {
      params[key] = value; // Keep as-is (offset, limit, etc.)
    }
  }
  return params;
}
