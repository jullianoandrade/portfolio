"use client";

import { useEffect, useRef, useState } from "react";

import { Familiar } from "@/components/abertura/Familiar";
import { AGENTE } from "@/conteudo/diagramas/agente";
import type { Cenas, NomeFamiliar, RotuloNo } from "@/conteudo/tipos";
import { Anfitriao, movimentoReduzido, useAoChegar } from "./Anfitriao";

/** Tempo de cada nó acendendo, em ms. */
const PASSO = 420;

const { largura: NO_L, altura: NO_A } = AGENTE.no;
const [, , VB_L, VB_A] = AGENTE.viewBox.split(" ").map(Number);
const POS = Object.fromEntries(AGENTE.nos.map((n) => [n.id, n]));

/** Posição em % sobre o desenho, para o que é HTML por cima do SVG. */
function sobre(x: number, y: number) {
  return { left: `${(x / VB_L) * 100}%`, top: `${(y / VB_A) * 100}%` };
}

/**
 * O agente de atendimento, funcionando: o visitante escolhe uma mensagem
 * fictícia e ela percorre o grafo real, nó a nó. O caminho e o que cada nó
 * faz vêm do caso; a geometria, de `conteudo/diagramas/agente.ts`.
 */
export function SimuladorAgente({
  textos,
  nos,
  carimbo,
  nomes,
  aoBarrar,
}: {
  textos: Cenas["construi"]["agente"];
  nos: Record<string, RotuloNo>;
  carimbo: string;
  nomes: Record<NomeFamiliar, string>;
  /** Avisa a bancada quando o guard barra, para abrir a decisão que explica. */
  aoBarrar?: () => void;
}) {
  const [sel, setSel] = useState(0);
  const simulacao = textos.simulacoes[sel];
  // Sem JavaScript, e antes de o visitante chegar, a conversa já aparece pronta.
  const [passo, setPasso] = useState(simulacao.caminho.length);
  const [foco, setFoco] = useState<string | null>(null);
  const relogio = useRef<number | undefined>(undefined);

  function tocar(i: number) {
    window.clearInterval(relogio.current);
    setSel(i);
    const total = textos.simulacoes[i].caminho.length;
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
    }, PASSO);
  }

  // Toca quando o visitante chega na bancada.
  const quadro = useAoChegar<HTMLDivElement>(() => tocar(0));
  useEffect(() => () => window.clearInterval(relogio.current), []);

  const { caminho } = simulacao;
  const acesos = new Set(caminho.slice(0, passo));
  const terminou = passo >= caminho.length;
  const iGuard = caminho.indexOf("guard");
  const barrou = Boolean(simulacao.barrado) && iGuard >= 0 && passo > iGuard;
  const rascunho = Boolean(simulacao.barrado) && passo > caminho.indexOf("compor");
  const ultimo = passo > 0 ? POS[caminho[passo - 1]] : undefined;

  useEffect(() => {
    if (barrou) aoBarrar?.();
  }, [barrou, aoBarrar]);

  function arestaAcesa(de: string, para: string) {
    const i = caminho.indexOf(de);
    return i >= 0 && caminho[i + 1] === para && passo > i + 1;
  }

  return (
    <div ref={quadro}>
      <div className="border border-regua bg-fundo-afundado p-5 sm:p-6">
        <p className="rotulo !text-[10px]">
          {textos.instrucao} · {textos.ficticia}
        </p>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {textos.simulacoes.map((s, i) => (
            <button
              key={s.pergunta}
              type="button"
              aria-pressed={i === sel}
              onClick={() => tocar(i)}
              className={`rounded-full px-4 py-1.5 font-mono text-xs transition-colors ${
                i === sel ? "bg-acento text-fundo" : "border border-regua-forte text-tinta-suave hover:border-acento hover:text-tinta"
              }`}
            >
              {s.pergunta}
            </button>
          ))}
        </div>

        {/* o grafo */}
        <div className="relative mx-auto mt-4 max-w-[31rem]" style={{ aspectRatio: `${VB_L} / ${VB_A}` }}>
          <svg viewBox={AGENTE.viewBox} className="absolute inset-0 size-full" role="img" aria-label={caminho.join(" → ")}>
            {AGENTE.arestas.map((a) => {
              const de = POS[a.de];
              const para = POS[a.para];
              const acesa = arestaAcesa(a.de, a.para);
              return (
                <line
                  key={`${a.de}-${a.para}`}
                  x1={de.x}
                  y1={de.y}
                  x2={para.x}
                  y2={para.y}
                  className="grafo-aresta"
                  stroke={acesa ? "#c9a45c" : "#2b343d"}
                  strokeWidth={acesa ? 3 : 2}
                  strokeDasharray={a.condicional && !acesa ? "6 6" : undefined}
                />
              );
            })}
            {AGENTE.nos.map((n) => {
              const aceso = acesos.has(n.id);
              const vermelho = n.id === "guard" && barrou;
              const atual = ultimo?.id === n.id && !terminou;
              return (
                <g
                  key={n.id}
                  className="grafo-no cursor-help outline-none"
                  tabIndex={0}
                  onMouseEnter={() => setFoco(n.id)}
                  onMouseLeave={() => setFoco(null)}
                  onFocus={() => setFoco(n.id)}
                  onBlur={() => setFoco(null)}
                >
                  <rect
                    x={n.x - NO_L / 2}
                    y={n.y - NO_A / 2}
                    width={NO_L}
                    height={NO_A}
                    rx={6}
                    fill={vermelho ? "#33221f" : atual ? "#2c2a22" : "#1c232a"}
                    stroke={vermelho ? "#c4553f" : foco === n.id ? "#e0c07e" : aceso ? "#c9a45c" : "#3a4651"}
                    strokeWidth={vermelho || atual ? 3 : aceso ? 2 : 1.5}
                  />
                  <text
                    x={n.x}
                    y={n.y + 6}
                    textAnchor="middle"
                    className="font-mono"
                    fontSize={16}
                    fill={aceso ? "#e8e1d1" : "#6f747a"}
                  >
                    {nos[n.id]?.rotulo ?? n.id}
                  </text>
                </g>
              );
            })}
            {ultimo && !terminou && <circle className="grafo-pulso" cx={ultimo.x} cy={ultimo.y + NO_A / 2} r={7} fill="#f0cf86" />}
          </svg>

          {/* o Guardião mora no guard */}
          <span className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2" style={sobre(POS.guard.x, POS.guard.y - 58)}>
            <Familiar nome="guardiao" className="familiar-vivo size-9 sm:size-11" />
          </span>

          {/* o que os nós trouxeram de fora */}
          {simulacao.dados?.map((d) =>
            passo > caminho.indexOf(d.no) && caminho.includes(d.no) ? (
              <span
                key={d.no}
                className="chip-dado pointer-events-none absolute -translate-x-1/2 rounded-[4px] border border-acento bg-fundo px-2.5 py-1 font-mono text-[10px] whitespace-nowrap text-acento-forte sm:text-xs"
                style={d.no === "handoff" ? sobre(POS.handoff.x + 170, POS.handoff.y - 14) : sobre(POS[d.no].x, POS[d.no].y - 66)}
              >
                {d.texto}
              </span>
            ) : null,
          )}

          {/* o rascunho que não passou */}
          {rascunho && (
            <span
              className="chip-dado pointer-events-none absolute -translate-x-1/2 rounded-[4px] border border-gargalo bg-fundo px-2.5 py-1 text-[11px] whitespace-nowrap text-tinta-suave sm:text-[13px]"
              style={sobre(POS.compor.x + 40, POS.compor.y - 70)}
            >
              <span className={barrou ? "line-through decoration-gargalo decoration-2" : ""}>{simulacao.barrado}</span>
            </span>
          )}
          {barrou && (
            <span
              className="carimbo-guard pointer-events-none absolute -translate-x-1/2 border-[3px] border-gargalo px-2.5 py-0.5 font-gravura text-sm whitespace-nowrap text-gargalo sm:text-base"
              style={sobre(POS.guard.x + 140, POS.guard.y - 66)}
            >
              {carimbo}
            </span>
          )}
        </div>

        {/* O que o nó faz, só para quem passa o mouse nele. */}
        <p className="mt-1 min-h-[2.5em] text-[13px] leading-snug text-tinta-fraca">
          {foco && (
            <>
              <span className="font-mono text-acento">{nos[foco]?.rotulo}</span> · {nos[foco]?.descricao}
            </>
          )}
        </p>

        {/* a conversa */}
        <div className="mt-2 space-y-2 border border-regua bg-fundo p-3 text-sm">
          <p className="ml-auto w-fit max-w-[85%] rounded-2xl bg-regua px-3.5 py-1.5 text-tinta">{simulacao.pergunta}</p>
          <p
            aria-live="polite"
            className={`w-fit max-w-[90%] rounded-2xl border border-acento px-3.5 py-1.5 text-tinta transition-opacity ${terminou ? "opacity-100" : "opacity-0"}`}
          >
            {simulacao.resposta}
          </p>
        </div>
      </div>

      <Anfitriao
        nome={simulacao.anfitriao}
        rotulo={nomes[simulacao.anfitriao]}
        fala={terminou ? simulacao.fala : ["…"]}
        className="mt-5"
      />
    </div>
  );
}
