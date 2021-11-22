import { useMatchRoute } from 'react-location';


export function useMultiMatchRoute(): UseMultiMatchRoute {
  const matchRoute = useMatchRoute();

  const multiMatchRoute = (paths: string[]): boolean => {
    return paths.some((to) => matchRoute({ to }));
  };

  return {
    matchRoute,
    multiMatchRoute,
  };
}

interface UseMultiMatchRoute {
  matchRoute: ReturnType<typeof useMatchRoute>;
  multiMatchRoute: (paths: string[]) => boolean;
}
