import { useLocation } from 'react-router';


export function useQuery(): URLSearchParams {
  const location = useLocation();

  return new URLSearchParams(location.search);
}
