"use client";

import { useEffect, useRef } from "react";

import { Familiar } from "@/components/abertura/Familiar";
import type { NomeFamiliar } from "@/conteudo/tipos";

/**
 * O agente que fala com o visitante numa cena: ele e o balão. A fala muda
 * conforme o que o visitante faz; a `key` faz a troca animar.
 */
export function Anfitriao({
  nome,
  rotulo,
  fala,
  className = "",
}: {
  nome: NomeFamiliar;
  /** Nome do agente, para quem usa leitor de tela. */
  rotulo: string;
  fala: [string, string] | [string];
  className?: string;
}) {
  return (
    <div className={`anfitriao flex items-center gap-3.5 ${className}`}>
      <Familiar nome={nome} className="familiar-vivo size-12 shrink-0" />
      <div className="balao max-w-[30rem]" aria-live="polite">
        <span className="sr-only">{rotulo}: </span>
        <p key={fala.join("|")} className="balao-texto">
          <span className="text-tinta">{fala[0]}</span>
          {fala[1] && <span className="block text-tinta-suave">{fala[1]}</span>}
        </p>
      </div>
    </div>
  );
}

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
