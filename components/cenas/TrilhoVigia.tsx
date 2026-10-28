"use client";

import { useEffect, useState } from "react";

import { Familiar } from "@/components/abertura/Familiar";

/**
 * O Vigia no canto direito: uma luz por cena, a acesa é onde você está. É o
 * "lá na frente" dele virando navegação — ele vê a cena seguinte antes.
 */
export function TrilhoVigia({ cenas, rotulo }: { cenas: { id: string; nome: string }[]; rotulo: string }) {
  const [atual, setAtual] = useState(cenas[0]?.id);

  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setAtual(e.target.id);
      },
      // Conta como "a cena" a que cruza a faixa do meio da tela.
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const c of cenas) {
      const el = document.getElementById(c.id);
      if (el) observador.observe(el);
    }
    return () => observador.disconnect();
  }, [cenas]);

  return (
    <nav
      aria-label={rotulo}
      // No hero o Vigia já mora lá em cima: o trilho só aparece quando ele desce.
      data-escondido={atual === cenas[0]?.id}
      className="trilho fixed top-1/2 right-4 z-30 hidden -translate-y-1/2 flex-col items-center transition-opacity duration-700 lg:flex"
    >
      <Familiar nome="vigia" className="familiar-vivo size-9" />
      <span className="mt-2 h-6 w-px bg-gradient-to-b from-[#e9c47a]/50 to-regua" aria-hidden />
      <ol className="relative flex flex-col items-center gap-[26px] py-1">
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-regua" aria-hidden />
        {cenas.map((c) => (
          <li key={c.id} className="relative">
            <a href={`#${c.id}`} className="trilho-item block p-1" aria-current={atual === c.id ? "true" : undefined}>
              <span
                className="trilho-ponto relative block size-2.5 rounded-full border border-regua-forte bg-fundo"
                aria-current={atual === c.id ? "true" : undefined}
              />
              <span className="trilho-nome pointer-events-none absolute top-1/2 right-full mr-2 rounded-[3px] bg-acento px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] whitespace-nowrap text-fundo uppercase">
                {c.nome}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
