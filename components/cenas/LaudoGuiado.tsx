"use client";

import { useEffect, useRef, useState } from "react";

import type { Cenas, NomeFamiliar } from "@/conteudo/tipos";
import { Anfitriao, movimentoReduzido, useAoChegar } from "./Anfitriao";

const ETAPAS = 5;
const PROJETOS = ["A", "B"];
const SECOES = 6;
/** A seção que fica sem dado quando falta informação no checklist. */
const SECAO_LACUNA = 3;
const TEMPO = 240;

/**
 * O laudo, em miniatura: o checklist de 5 etapas, uma chamada de modelo por
 * projeto e mais uma para a conclusão, e as 6 seções do PDF. Se faltou
 * informação, a seção sai como pendência, nunca preenchida por suposição.
 */
export function LaudoGuiado({
  textos,
  nomes,
}: {
  textos: Cenas["construi"]["laudo"];
  nomes: Record<NomeFamiliar, string>;
}) {
  const total = ETAPAS + PROJETOS.length + 1 + SECOES;
  const [faltou, setFaltou] = useState(true);
  const [passo, setPasso] = useState(total);
  const relogio = useRef<number | undefined>(undefined);

  function gerar() {
    window.clearInterval(relogio.current);
    if (movimentoReduzido()) {
      setPasso(total);
      return;
    }
    setPasso(0);
    let n = 0;
    relogio.current = window.setInterval(() => {
      n += 1;
      setPasso(n);
      if (n >= total) window.clearInterval(relogio.current);
    }, TEMPO);
  }

  // Toca quando o visitante chega na bancada.
  const quadro = useAoChegar<HTMLDivElement>(() => gerar());
  useEffect(() => () => window.clearInterval(relogio.current), []);

  const etapasFeitas = Math.min(passo, ETAPAS);
  const chamadas = Math.max(0, Math.min(passo - ETAPAS, PROJETOS.length + 1));
  const secoes = Math.max(0, passo - ETAPAS - PROJETOS.length - 1);
  const terminou = passo >= total;

  return (
    <div ref={quadro}>
      <div className="border border-regua bg-fundo-afundado p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={gerar}
            className="rounded-full bg-acento px-4 py-1.5 font-mono text-xs text-fundo transition-colors hover:bg-acento-forte"
          >
            {textos.gerar}
          </button>
          <label className="flex cursor-pointer items-center gap-2 font-mono text-xs text-tinta-suave">
            <input
              type="checkbox"
              checked={faltou}
              onChange={(e) => setFaltou(e.target.checked)}
              className="size-3.5 accent-[#c9a45c]"
            />
            {textos.faltou}
          </label>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]">
          {/* checklist e chamadas */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.14em] text-tinta-fraca uppercase">{textos.checklist}</p>
            <ol className="mt-2 space-y-1.5 font-mono text-xs">
              {Array.from({ length: ETAPAS }, (_, i) => {
                const feita = i < etapasFeitas;
                const lacuna = faltou && i === ETAPAS - 2;
                return (
                  <li key={i} className={`flex items-center gap-2 ${feita ? "text-tinta" : "text-tinta-fraca"}`}>
                    <span
                      className={`grid size-4 place-items-center rounded-[3px] border text-[10px] ${
                        feita ? (lacuna ? "border-gargalo text-gargalo" : "border-acento text-acento") : "border-regua-forte"
                      }`}
                    >
                      {feita ? (lacuna ? "!" : "✓") : ""}
                    </span>
                    {textos.etapa} {i + 1}
                  </li>
                );
              })}
            </ol>
            <ul className="mt-5 space-y-1.5 font-mono text-[11px]">
              {[...PROJETOS.map((p) => `${textos.projeto} ${p}`), textos.conclusao].map((nome, i) => (
                <li
                  key={nome}
                  className={`flex justify-between border px-2 py-1 transition-colors ${
                    i < chamadas ? "border-acento text-tinta" : "border-regua text-tinta-fraca"
                  }`}
                >
                  <span>{nome}</span>
                  <span className={i < chamadas ? "text-acento" : ""}>{textos.chamada}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* o PDF */}
          <div className="flex flex-col border border-regua-forte bg-fundo-elevado p-4">
            <div className="grid flex-1 grid-cols-2 gap-3">
              {Array.from({ length: SECOES }, (_, i) => {
                const pronta = i < secoes;
                const lacuna = faltou && i === SECAO_LACUNA;
                return (
                  <div
                    key={i}
                    className={`min-h-[64px] border p-2 transition-colors ${
                      pronta ? (lacuna ? "border-dashed border-gargalo" : "border-regua-forte") : "border-regua"
                    }`}
                  >
                    <p className={`font-mono text-[10px] ${pronta ? "text-acento" : "text-tinta-fraca"}`}>
                      {textos.secao} {i + 1}
                    </p>
                    {pronta &&
                      (lacuna ? (
                        <p className="chip-dado mt-1.5 text-[11px] leading-snug text-gargalo">{textos.pendencia}</p>
                      ) : (
                        <div className="chip-dado mt-2 space-y-1.5">
                          <span className="block h-1 w-[90%] bg-regua-forte" />
                          <span className="block h-1 w-[70%] bg-regua-forte" />
                          <span className="block h-1 w-[80%] bg-regua-forte" />
                        </div>
                      ))}
                  </div>
                );
              })}
            </div>
            <p className="mt-3 border-t border-regua pt-2 font-mono text-[9.5px] tracking-[0.06em] text-tinta-fraca">
              {textos.rodape}
            </p>
          </div>
        </div>
      </div>

      <Anfitriao
        nome="arquiteto"
        rotulo={nomes.arquiteto}
        fala={terminou ? textos.fala : ["…"]}
        className="mt-5"
      />
    </div>
  );
}
