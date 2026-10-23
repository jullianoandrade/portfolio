"use client";

import { useEffect, useRef } from "react";

import { DIAGRAMAS, type Diagrama, type NoGeometria } from "@/conteudo/diagramas/agente";
import type { RotuloNo } from "@/conteudo/tipos";

/**
 * Desenha o grafo da arquitetura e o revela nó a nó conforme a pessoa desce.
 *
 * Duas decisões que valem explicar:
 *
 * 1. O JavaScript só adiciona a classe `visivel` no <svg>. O escalonamento é
 *    `transition-delay` em CSS, calculado a partir do índice do nó. Nenhum
 *    laço de animação, nenhum requestAnimationFrame.
 *
 * 2. As descrições não vão dentro do SVG. Texto em SVG não quebra linha
 *    sozinho, não é selecionável de forma confiável e some em leitor de tela.
 *    O desenho mostra a forma; a lista abaixo explica cada nó — e é ela que
 *    carrega o conteúdo para quem usa leitor de tela e para o buscador.
 */

function centroDireita(no: NoGeometria, d: Diagrama) {
  return { x: no.x + d.no.largura / 2, y: no.y };
}
function centroEsquerda(no: NoGeometria, d: Diagrama) {
  return { x: no.x - d.no.largura / 2, y: no.y };
}
function centroBaixo(no: NoGeometria, d: Diagrama) {
  return { x: no.x, y: no.y + d.no.altura / 2 };
}
function centroCima(no: NoGeometria, d: Diagrama) {
  return { x: no.x, y: no.y - d.no.altura / 2 };
}

/**
 * Caminho ortogonal entre dois nós. Mesma linha vira reta horizontal; linhas
 * diferentes descem, atravessam e entram pelo topo do destino.
 */
function caminho(de: NoGeometria, para: NoGeometria, d: Diagrama): string {
  if (de.y === para.y) {
    const a = centroDireita(de, d);
    const b = centroEsquerda(para, d);
    return `M ${a.x} ${a.y} H ${b.x}`;
  }
  const a = centroBaixo(de, d);
  const b = centroCima(para, d);
  const meio = a.y + (b.y - a.y) / 2;
  return `M ${a.x} ${a.y} V ${meio} H ${b.x} V ${b.y}`;
}

export function DiagramaArquitetura({
  diagramaId,
  nos,
  legenda,
  titulo,
}: {
  diagramaId: string;
  nos: Record<string, RotuloNo>;
  legenda?: string;
  /** Título acessível do desenho. */
  titulo: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const diagrama = DIAGRAMAS[diagramaId];

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          entrada.target.classList.add("visivel");
          observador.unobserve(entrada.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );
    observador.observe(svg);
    return () => observador.disconnect();
  }, []);

  if (!diagrama) return null;

  const indice = new Map(diagrama.nos.map((n, i) => [n.id, i]));
  const porId = new Map(diagrama.nos.map((n) => [n.id, n]));
  const PASSO = 90; // ms entre um nó e o seguinte

  return (
    <figure className="my-10">
      <div className="overflow-x-auto rounded-[--borda-raio] border border-regua bg-fundo-afundado p-4 sm:p-6">
        <svg
          ref={ref}
          viewBox={diagrama.viewBox}
          role="img"
          aria-label={titulo}
          className="diagrama h-auto w-full"
          style={{ minWidth: diagrama.larguraMinima }}
        >
          <defs>
            <marker
              id="seta"
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 7 4 L 0 7 z" fill="var(--regua-forte)" />
            </marker>
          </defs>

          {diagrama.arestas.map((aresta) => {
            const de = porId.get(aresta.de);
            const para = porId.get(aresta.para);
            if (!de || !para) return null;
            const atraso = ((indice.get(aresta.para) ?? 0) * PASSO) - PASSO / 2;
            return (
              <path
                key={`${aresta.de}-${aresta.para}`}
                className="aresta"
                d={caminho(de, para, diagrama)}
                fill="none"
                stroke="var(--regua-forte)"
                strokeWidth={1.5}
                strokeDasharray={aresta.condicional ? "5 4" : undefined}
                markerEnd="url(#seta)"
                style={{ "--atraso": `${Math.max(0, atraso)}ms` } as React.CSSProperties}
              />
            );
          })}

          {diagrama.nos.map((no, i) => {
            const rotulo = nos[no.id];
            if (!rotulo) return null;
            return (
              <g
                key={no.id}
                className="no"
                style={{ "--atraso": `${i * PASSO}ms` } as React.CSSProperties}
              >
                <rect
                  x={no.x - diagrama.no.largura / 2}
                  y={no.y - diagrama.no.altura / 2}
                  width={diagrama.no.largura}
                  height={diagrama.no.altura}
                  rx={8}
                  fill="var(--fundo)"
                  stroke={no.enfase ? "var(--acento)" : "var(--regua-forte)"}
                  strokeWidth={no.enfase ? 2 : 1.5}
                />
                <text
                  x={no.x}
                  y={no.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="var(--font-mono), ui-monospace, monospace"
                  fontSize={15}
                  fill={no.enfase ? "var(--acento)" : "var(--tinta)"}
                >
                  {rotulo.rotulo}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {legenda ? (
        <figcaption className="mt-3 text-sm text-tinta-fraca">{legenda}</figcaption>
      ) : null}

      <ol className="mt-7 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {diagrama.nos.map((no) => {
          const rotulo = nos[no.id];
          if (!rotulo) return null;
          return (
            <li key={no.id} className="text-sm leading-relaxed">
              <span
                className={`font-mono text-[0.8125rem] ${
                  no.enfase ? "text-acento" : "text-tinta"
                }`}
              >
                {rotulo.rotulo}
              </span>
              <span className="text-tinta-suave"> — {rotulo.descricao}</span>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
