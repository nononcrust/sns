import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";

interface IntersectionObserverProps {
  onIntersect: () => void;
}

export const IntersectionObserver = ({ onIntersect }: IntersectionObserverProps) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useIntersectionObserver(observerRef, onIntersect);

  return <div ref={observerRef} role="presentation" />;
};
