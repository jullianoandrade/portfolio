"use client";

import { useEffect, useRef } from "react";

/** Sem animação quando quem visita pediu menos movimento. */
export function movimentoReduzido() {
  return typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Chama `aoChegar` uma vez, quando o elemento entra na tela — para a cena
 * tocar quando o visitante chega nela, e não enquanto ainda está lá em cima.
 */
export function useAoChegar<T extends Element>(aoChegar: () => void, limiar = 0.35) {
  const ref = useRef<T>(null);
  const chamada = useRef(aoChegar);
  useEffect(() => {
    chamada.current = aoChegar;
  });

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        observador.disconnect();
        chamada.current();
      },
      { threshold: limiar },
    );
    observador.observe(elemento);
    return () => observador.disconnect();
  }, [limiar]);

  return ref;
}
