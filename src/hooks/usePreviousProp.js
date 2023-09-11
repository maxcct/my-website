import { useEffect, useRef, } from 'react';

const usePreviousProp = (prop) => {
  const ref = useRef();
  useEffect(() => {
      ref.current = prop;
  });
  return ref.current;
};

export default usePreviousProp;
