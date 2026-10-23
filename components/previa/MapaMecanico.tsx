"use client";

import { useEffect, useRef } from "react";

/**
 * O território em que cada caso se ergue sobre engrenagens.
 *
 * Mesma regra das outras animações do site: o JavaScript só adiciona a classe
 * `visivel` no <svg> quando ele entra na tela. O giro das engrenagens e a
 * subida das estruturas são CSS (`mapa.css`), escalonados por duas variáveis —
 * `--e` (qual estrutura) e `--b` (qual bloco dela).
 */

export interface Estrutura {
  slug: string;
  x: number;
  y: number;
  dominio: string;
  valor: string;
  rotulo: string;
}

/** Contorno de engrenagem: dente trapezoidal, raio interno e externo. */
function engrenagem(cx: number, cy: number, dentes: number, rExt: number, rInt: number) {
  const passo = (Math.PI * 2) / dentes;
  const pontos: string[] = [];
  for (let i = 0; i < dentes; i++) {
    const a = i * passo;
    for (const [fracao, raio] of [
      [0, rInt],
      [0.18, rExt],
      [0.5, rExt],
      [0.68, rInt],
    ] as const) {
      const angulo = a + passo * fracao;
      pontos.push(`${(cx + Math.cos(angulo) * raio).toFixed(1)},${(cy + Math.sin(angulo) * raio).toFixed(1)}`);
    }
  }
  return `M${pontos.join(" L")} Z`;
}

// Costa irregular de propósito: curva suave demais lê como nuvem, não como terra.
const TERRA =
  "M70,210 L96,168 L132,150 L150,118 L196,104 L232,116 L268,92 L318,98 L352,122 L388,96 L430,74 L476,82 L512,64 L560,70 L596,92 L640,86 L676,70 L722,80 L760,104 L806,98 L846,122 L884,138 L912,176 L938,206 L930,248 L948,286 L926,326 L904,350 L884,394 L842,420 L818,456 L770,472 L724,492 L676,484 L636,506 L588,500 L548,520 L498,508 L456,492 L414,500 L372,478 L330,488 L290,470 L244,474 L206,452 L168,430 L136,400 L112,364 L82,336 L64,296 L76,258 Z";

const CONTORNO =
  "M104,214 L128,182 L162,166 L180,138 L220,128 L258,136 L294,118 L340,124 L372,146 L408,122 L448,102 L486,110 L520,94 L562,100 L598,120 L640,114 L678,100 L720,108 L754,130 L796,126 L832,148 L866,162 L890,196 L912,222 L904,258 L918,290 L898,322 L876,344 L858,382 L820,404 L796,436 L754,450 L712,466 L670,460 L632,480 L588,474 L548,492 L502,482 L462,468 L420,474 L380,454 L336,462 L298,446 L252,448 L218,428 L184,408 L156,380 L136,348 L108,322 L94,288 L104,256 Z";

const ILHAS = [
  "M960,96 L980,88 L992,104 L980,120 L962,116 Z",
  "M24,420 L44,408 L60,422 L50,442 L30,440 Z",
  "M880,500 L904,494 L918,510 L902,524 L882,518 Z",
];

export function MapaMecanico({
  estruturas,
  rotas,
  titulo,
}: {
  estruturas: Estrutura[];
  rotas: [string, string][];
  titulo: string;
}) {
  const ref = useRef<SVGSVGElement>(null);

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
      { threshold: 0.25 },
    );
    observador.observe(svg);
    return () => observador.disconnect();
  }, []);

  const porSlug = new Map(estruturas.map((e) => [e.slug, e]));

  return (
    <div className="overflow-x-auto">
      <svg
        ref={ref}
        viewBox="0 0 1000 560"
        role="img"
        aria-label={titulo}
        className="mp-mapa h-auto w-full"
        style={{ minWidth: 720 }}
      >
        <path d={TERRA} className="mp-terra" />
        {ILHAS.map((d) => (
          <path key={d} d={d} className="mp-terra" />
        ))}
        <path d={CONTORNO} className="mp-contorno" />

        {rotas.map(([de, para]) => {
          const a = porSlug.get(de);
          const b = porSlug.get(para);
          if (!a || !b) return null;
          const meioX = (a.x + b.x) / 2;
          const meioY = Math.min(a.y, b.y) - 40;
          return (
            <path
              key={`${de}-${para}`}
              className="mp-rota"
              d={`M${a.x},${a.y + 20} Q${meioX},${meioY} ${b.x},${b.y + 20}`}
            />
          );
        })}

        {estruturas.map((e, i) => (
          <g key={e.slug} style={{ "--e": i } as React.CSSProperties}>
            <g className="mp-engrenagem">
              <path d={engrenagem(e.x, e.y + 20, 10, 30, 23)} className="mp-dente" />
              <circle cx={e.x} cy={e.y + 20} r={7} className="mp-eixo" />
            </g>

            {/* A estrutura sobe da base, bloco por bloco */}
            <rect
              className="mp-bloco"
              style={{ "--b": 0 } as React.CSSProperties}
              x={e.x - 24}
              y={e.y - 22}
              width={48}
              height={22}
            />
            <rect
              className="mp-bloco"
              style={{ "--b": 1 } as React.CSSProperties}
              x={e.x - 16}
              y={e.y - 42}
              width={32}
              height={20}
            />
            <rect
              className="mp-bloco"
              style={{ "--b": 2 } as React.CSSProperties}
              x={e.x - 9}
              y={e.y - 58}
              width={18}
              height={16}
            />
            <path
              className="mp-bloco mp-pico"
              style={{ "--b": 3 } as React.CSSProperties}
              d={`M${e.x},${e.y - 76} L${e.x + 7},${e.y - 66} L${e.x},${e.y - 58} L${e.x - 7},${e.y - 66} Z`}
            />

            <g className="mp-legenda">
              <text x={e.x} y={e.y + 74} textAnchor="middle" className="mp-texto-dominio">
                {e.dominio}
              </text>
              <text x={e.x} y={e.y + 96} textAnchor="middle" className="mp-texto-valor">
                {e.valor}
                <tspan className="mp-texto-rotulo"> {e.rotulo}</tspan>
              </text>
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
