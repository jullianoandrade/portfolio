"use client";

import { useRef, useState } from "react";

import { Familiar } from "@/components/abertura/Familiar";
import { FAMILIARES, type Cenas, type NomeFamiliar } from "@/conteudo/tipos";
import { hashDoSistema } from "./endereco";
import { Letras } from "./Letras";
import { pontoEm, useMontagem } from "./montagem";
import { ditarLetras, riscarComLaser } from "./oficio";
import { Voador, type Voo } from "./Voador";

/** O ritmo da escrita do título: quando a primeira letra acende e o passo (iguais ao CSS). */
const INICIO_LETRAS = 300;
const PASSO_LETRA = 40;
/** Quanto o Arquiteto leva para riscar o painel. */
const RISCO = 750;

/**
 * Cena 4. Os seis agentes numa fileira, cada um com a regra que o justifica.
 * Passar o mouse, focar ou tocar num deles abre a ficha: o que faz no site,
 * por que existe e o caso que prova.
 *
 * Na primeira chegada, o time monta a cena em silêncio, cada um com o seu
 * ofício: o Escriba passa por baixo do título e as letras saem do livro, o
 * Vigia varre a fileira e cada agente aparece quando a luz passa, o
 * Arquiteto risca o painel com o laser e o Guardião carimba a ficha.
 */
export function Time({ textos, nomes }: { textos: Cenas["time"]; nomes: Record<NomeFamiliar, string> }) {
  const [ativo, setAtivo] = useState<NomeFamiliar>("guardiao");
  const [voo, setVoo] = useState<Voo | null>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  const fileira = useRef<HTMLUListElement>(null);
  const relogios = useRef<ReturnType<typeof setTimeout>[]>([]);
  const ficha = textos.fichas[ativo];
  const ESCRITA = INICIO_LETRAS + (textos.titulo[0].length + textos.titulo[1].length) * PASSO_LETRA + 150;

  const raiz = useMontagem<HTMLDivElement>(
    "time",
    [
      ["vazia", 350],
      ["titulo", ESCRITA],
      ["agentes", 1150],
      ["painel", RISCO + 450],
      ["ficha", 1300],
    ],
    (estado, el) => {
      if (estado === "vazia") {
        const p = pontoEm(el, titulo.current, 0, 1, -24, 4);
        if (p) setVoo({ nome: "escriba", ...p });
      } else if (estado === "titulo") {
        const p = pontoEm(el, titulo.current, 1, 1, -24, 4);
        if (p) setVoo({ nome: "escriba", ...p, dur: ESCRITA });
        const letras = [...el.querySelectorAll<HTMLElement>(".letra-cai")];
        relogios.current.push(...ditarLetras(el, letras, INICIO_LETRAS, PASSO_LETRA));
      } else if (estado === "agentes") {
        const p = pontoEm(el, fileira.current, 1, 0, -20, -64);
        if (p) setVoo({ nome: "vigia", ...p });
      } else if (estado === "painel") {
        // No canto de baixo, fora da fileira: o feixe alcança o painel inteiro.
        const p = pontoEm(el, painel.current, 1, 1, 18, -40);
        if (p) setVoo({ nome: "arquiteto", ...p });
        relogios.current.push(
          setTimeout(() => painel.current && void riscarComLaser(el, painel.current, RISCO), 400),
        );
      } else if (estado === "ficha") {
        const p = pontoEm(el, painel.current, 1, 0, -40, -70);
        if (p) setVoo({ nome: "guardiao", ...p, gesto: "investir" });
      } else {
        relogios.current.forEach(clearTimeout);
        relogios.current = [];
        el.querySelectorAll(".letra-ditada, .risco-laser, .faisca-voa").forEach((x) => x.remove());
        setVoo(null);
      }
    },
  );

  return (
    <div ref={raiz} className="time-cena relative grid items-center gap-12 lg:grid-cols-[minmax(0,27rem)_minmax(0,1fr)]">
      <div>
        <p className="rotulo !text-acento">{textos.rotulo}</p>
        <h2
          ref={titulo}
          aria-label={textos.titulo.join(" ")}
          className="mt-5 w-fit font-gravura text-4xl leading-[1.15] sm:text-[2.6rem]"
        >
          {textos.titulo.map((linha, l) => (
            <span key={l} className="block">
              <Letras texto={linha} classe="letra-cai" inicio={l ? textos.titulo[0].length : 0} />
            </span>
          ))}
        </h2>
        <p className="time-texto mt-6 max-w-[40ch] text-base leading-relaxed text-tinta-suave">{textos.texto}</p>

        <div
          ref={painel}
          key={ativo}
          className="painel-andar relative mt-8 border border-acento bg-fundo-elevado p-6 sm:p-7"
          aria-live="polite"
        >
          <span className="carimbo-conferido" aria-hidden>
            {textos.montagem.carimbo}
          </span>
          <p className="rotulo !text-acento">{nomes[ativo]}</p>
          <p className="mt-4 font-gravura text-[1.4rem] leading-snug">{ficha.regra}</p>
          <dl className="mt-6 space-y-4 text-[14px] leading-relaxed">
            <div>
              <dt className="font-mono text-[10px] tracking-[0.14em] text-tinta-fraca uppercase">{textos.rotulos.porQue}</dt>
              <dd className="mt-1 text-tinta-suave">{ficha.porQue}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-[0.14em] text-tinta-fraca uppercase">{textos.rotulos.onde}</dt>
              <dd className="mt-1">
                <a href={hashDoSistema(ficha.onde.caso)} className="text-acento transition-colors hover:text-acento-forte">
                  {ficha.onde.texto} →
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <ul ref={fileira} className="fileira-agentes relative grid grid-cols-3 gap-x-4 gap-y-12 sm:grid-cols-6 sm:gap-x-2">
        {FAMILIARES.map((nome, n) => {
          const eh = nome === ativo;
          return (
            <li key={nome} style={{ "--n": n } as React.CSSProperties}>
              <button
                type="button"
                aria-pressed={eh}
                onMouseEnter={() => setAtivo(nome)}
                onFocus={() => setAtivo(nome)}
                onClick={() => setAtivo(nome)}
                className="group flex w-full flex-col items-center text-center"
              >
                <span className="vaga-agente relative grid h-24 place-items-end">
                  {eh && <span className="absolute bottom-0 left-1/2 h-3 w-20 -translate-x-1/2 rounded-[50%] bg-acento/20" />}
                  <span data-ativo={eh} className="agente-fileira block origin-bottom opacity-55 group-hover:opacity-90">
                    <Familiar nome={nome} className={`size-14 ${eh ? "familiar-vivo" : ""}`} />
                  </span>
                </span>
                <span
                  className={`nome-agente mt-4 rounded-[3px] px-2 py-0.5 font-mono text-[11px] tracking-[0.14em] uppercase ${
                    eh ? "bg-acento text-fundo" : "text-tinta-suave"
                  }`}
                >
                  {nomes[nome]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {voo && <Voador key={voo.nome} voo={voo} rotulo={nomes[voo.nome]} />}
    </div>
  );
}
