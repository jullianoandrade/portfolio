"use client";

import { useEffect, useRef, useState } from "react";

import type { Cenas, NomeFamiliar } from "@/conteudo/tipos";
import { Anfitriao, movimentoReduzido, useAoChegar } from "./Anfitriao";

const COLUNAS = 9;
const LINHAS = 12;
/** As colunas que o cruzamento usa: quem é a pessoa, o que foi pago, o que foi retido. */
const USADAS = new Set([1, 4, 6]);
/** Linha a linha, a memória enche antes de a tabela acabar. */
const LINHA_CHEIA = 8;
const TEMPO = 260;

type Modo = "linha" | "coluna";

/**
 * Os 16 milhões de linhas, em miniatura: a mesma tabela lida dos dois
 * jeitos. Linha a linha, tudo vai para a memória do notebook até ela encher;
 * em colunas, só o que o cruzamento usa sai do disco, aos blocos.
 */
export function LeituraColunar({
  textos,
  nomes,
}: {
  textos: Cenas["construi"]["ingestao"];
  nomes: Record<NomeFamiliar, string>;
}) {
  const [modo, setModo] = useState<Modo>("coluna");
  // Sem JavaScript: a leitura em colunas, já terminada.
  const [passo, setPasso] = useState(LINHAS);
  const relogio = useRef<number | undefined>(undefined);

  function tocar(m: Modo) {
    window.clearInterval(relogio.current);
    setModo(m);
    const fim = m === "linha" ? LINHA_CHEIA : LINHAS;
    if (movimentoReduzido()) {
      setPasso(fim);
      return;
    }
    setPasso(0);
    let n = 0;
    relogio.current = window.setInterval(() => {
      n += 1;
      setPasso(n);
      if (n >= fim) window.clearInterval(relogio.current);
    }, m === "linha" ? TEMPO * 1.6 : TEMPO);
  }

  // Toca quando o visitante chega na bancada.
  const quadro = useAoChegar<HTMLDivElement>(() => tocar("linha"));
  useEffect(() => () => window.clearInterval(relogio.current), []);

  const linha = modo === "linha";
  const memoria = linha ? (passo / LINHA_CHEIA) * 100 : passo > 0 ? 22 + (passo % 3) * 3 : 0;
  const cheia = linha && passo >= LINHA_CHEIA;
  const terminou = !linha && passo >= LINHAS;

  return (
    <div ref={quadro}>
      <div className="border border-regua bg-fundo-afundado p-5 sm:p-6">
        <div className="flex flex-wrap gap-2.5">
          {(["linha", "coluna"] as Modo[]).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={modo === m}
              onClick={() => tocar(m)}
              className={`rounded-full px-4 py-1.5 font-mono text-xs transition-colors ${
                modo === m ? "bg-acento text-fundo" : "border border-regua-forte text-tinta-suave hover:border-acento hover:text-tinta"
              }`}
            >
              {m === "linha" ? textos.linhaALinha : textos.emColunas}
            </button>
          ))}
          <span className="ml-auto self-center font-mono text-[11px] text-acento">{textos.escala}</span>
        </div>

        <p className="mt-6 font-mono text-[10px] tracking-[0.14em] text-tinta-fraca uppercase">{textos.tabela}</p>
        <div
          className="mt-2 grid gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${COLUNAS}, minmax(0, 1fr))` }}
          aria-hidden
        >
          {Array.from({ length: LINHAS * COLUNAS }, (_, k) => {
            const l = Math.floor(k / COLUNAS);
            const c = k % COLUNAS;
            let cor = "#232b33";
            if (linha) {
              if (l < passo) cor = cheia && l >= LINHA_CHEIA - 2 ? "#c4553f" : "#6f747a";
            } else if (USADAS.has(c)) {
              cor = l < passo ? "#c9a45c" : "#3a4651";
            }
            return <span key={k} className="celula block h-3.5 rounded-[1px]" style={{ background: cor }} />;
          })}
        </div>

        <div className="mt-6">
          <div className="flex justify-between font-mono text-[10px] tracking-[0.14em] text-tinta-fraca uppercase">
            <span>{textos.memoria}</span>
            <span className={cheia ? "text-gargalo" : ""}>{Math.round(memoria)}%</span>
          </div>
          <div className="mt-2 h-2.5 border border-regua-forte bg-fundo">
            <span
              className="barra-memoria block h-full"
              style={{ width: `${memoria}%`, background: cheia ? "#c4553f" : linha ? "#a9a596" : "#c9a45c" }}
            />
          </div>
        </div>

        <div className="mt-5 min-h-[3.2em] font-mono text-xs leading-relaxed" aria-live="polite">
          <p className={linha ? (cheia ? "text-gargalo" : "text-tinta-suave") : "text-tinta-suave"}>
            {linha ? textos.estadoLinha : textos.estadoColuna}
          </p>
          {terminou && <p className="chip-dado text-acento-forte">✓ {textos.persistido}</p>}
        </div>
      </div>

      <Anfitriao
        nome={linha ? "vigia" : "triador"}
        rotulo={linha ? nomes.vigia : nomes.triador}
        fala={linha ? [textos.fala[0]] : [textos.fala[1]]}
        className="mt-5"
      />
    </div>
  );
}
