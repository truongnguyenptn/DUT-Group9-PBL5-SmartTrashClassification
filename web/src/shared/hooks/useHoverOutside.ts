import { RefObject, useEffect } from 'react';

interface UseHoverOutside<E extends HTMLElement> {
  ref: RefObject<E>;
  onHoverOutside?: () => void;
}

export default function useHoverOutside<E extends HTMLElement>({
  ref,
  onHoverOutside,
}: UseHoverOutside<E>) {
  useEffect(() => {
    const handleHoverOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onHoverOutside?.();
      }
    };
    document.addEventListener('mouseenter', handleHoverOutside);
    return () => {
      document.removeEventListener('mouseenter', handleHoverOutside);
    };
  }, [onHoverOutside, ref]);
}
