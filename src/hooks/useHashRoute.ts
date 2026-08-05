import { useEffect, useState, useCallback } from 'react';

export function useHashRoute(): [string, (to: string) => void] {
  const [route, setRoute] = useState(() => parseHash());

  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = useCallback((to: string) => {
    window.location.hash = to;
  }, []);

  return [route, navigate];
}

function parseHash(): string {
  const h = window.location.hash.replace(/^#\/?/, '');
  return h || 'home';
}
