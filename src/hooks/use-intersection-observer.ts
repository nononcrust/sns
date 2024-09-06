import { RefObject, useEffect } from "react";

export const useIntersectionObserver = (ref: RefObject<HTMLElement>, onIntersect: () => void) => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      console.log(entries);
      if (entries[0].isIntersecting) {
        onIntersect();
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref, onIntersect]);
};
