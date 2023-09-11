import { useEffect } from 'react';

const useDetectClickOutside = (ref, actionOnOutsideClick) => {
  useEffect(() => {
    const onClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        actionOnOutsideClick();
      }
    }

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [ref, actionOnOutsideClick]);
};

export default useDetectClickOutside;
