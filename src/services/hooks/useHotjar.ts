import { hotjar } from 'react-hotjar';
import { useLocation } from 'react-location';


interface UseHotJar {
  stateChange: () => void;
}

export function useHotjar(): UseHotJar {
  const location = useLocation();
  function stateChange() {
    if (__PROD__) {
      hotjar.stateChange(location.current.pathname);
    }
  }

  return {
    stateChange,
  };
}
