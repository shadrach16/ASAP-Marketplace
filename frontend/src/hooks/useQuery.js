import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A custom hook to get and parse URL query parameters.
 * @returns {URLSearchParams} An object to access query params, e.g., query.get('role')
 */
export function useQuery() {
  const { search } = useLocation();

  // useMemo ensures the URLSearchParams object is only created when the search string changes
  return useMemo(() => new URLSearchParams(search), [search]);
}