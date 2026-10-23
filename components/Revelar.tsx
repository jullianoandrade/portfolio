"use client";

import { useEffect, useRef } from "react";

/**
 * Revela o conteúdo quando ele entra na viewport.
 *
 * O JavaScript faz uma coisa só: adicionar a classe `visivel`. Quem anima é o
 * CSS em `globals.css`, que também respeita `prefers-reduced-motion`. Não há
 * JavaScript medindo tela nem calculando posição — mesmo critério do
 * economize_milhas.
 *
 * O observador para de observar cada elemento depois da primeira revelação:
 * o conteúdo não some ao rolar de volta, e não há trabalho residual.
 */
export function Revelar({
  children,
  atraso = 0,
  className = "",
}: {
  children: React.ReactNode;
  /** Atraso em ms, para escalonar itens de uma lista. */
  atraso?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    // Se o elemento já está visível na carga, revela sem esperar o observador.
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          entrada.target.classList.add("visivel");
          observador.unobserve(entrada.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`revelar ${className}`}
      style={atraso ? ({ "--atraso": `${atraso}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
