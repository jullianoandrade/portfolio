"use client";

import { useCallback, useEffect, useState } from "react";

import type { Caso, Cenas, Idioma, NomeFamiliar } from "@/conteudo/tipos";
import { ContaMilhas } from "./ContaMilhas";
import { EVENTO_IR } from "./Deslize";
import { PREFIXO_SISTEMA } from "./endereco";
import { LaudoGuiado } from "./LaudoGuiado";
import { LeituraColunar } from "./LeituraColunar";
import { PipelineContratos } from "./PipelineContratos";
import { SimuladorAgente } from "./SimuladorAgente";

/**
 * Cena 3. Um sistema por vez: à esquerda, gargalo → o que fiz → resultado e
 * as decisões; à direita, o sistema funcionando. Um link com
 * `#construi-<slug>` (cards do hero, andares do prédio, fichas do time)
 * abre a bancada naquele sistema.
 */
export function Bancada({
  casos,
  textos,
  etiquetas,
  rotulos,
  carimbo,
  idioma,
  nomes,
}: {
  casos: Caso[];
  textos: Cenas["construi"];
  etiquetas: Cenas["passei"]["etiquetas"];
  rotulos: { escolha: string; descartado: string; custo: string };
  carimbo: string;
  idioma: Idioma;
  nomes: Record<NomeFamiliar, string>;
}) {
  const [i, setI] = useState(0);
  const [aberto, setAberto] = useState(false);
  const [decisao, setDecisao] = useState(0);
  const caso = casos[i];
  const { vitrine } = caso;

  const ir = useCallback((n: number) => {
    setI(n);
    setAberto(false);
    setDecisao(0);
  }, []);

  // Chegar pelo endereço de um sistema escolhe ele e traz a bancada para a tela.
  useEffect(() => {
    function peloEndereco() {
      const alvo = decodeURIComponent(location.hash.slice(1));
      if (!alvo.startsWith(PREFIXO_SISTEMA)) return;
      const n = casos.findIndex((c) => c.slug === alvo.slice(PREFIXO_SISTEMA.length));
      if (n < 0) return;
      ir(n);
      dispatchEvent(new CustomEvent(EVENTO_IR, { detail: "construi" }));
    }
    peloEndereco();
    window.addEventListener("hashchange", peloEndereco);
    return () => window.removeEventListener("hashchange", peloEndereco);
  }, [casos, ir]);

  const abrirDecisao = useCallback(() => setAberto(true), []);
  const anterior = (i - 1 + casos.length) % casos.length;
  const proximo = (i + 1) % casos.length;

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,37rem)] lg:gap-12">
      {/* ------------------------------------------------- a explicação */}
      <div className="flex min-h-full flex-col">
        <p className="rotulo !text-acento">{textos.rotulo}</p>
        <div className="mt-4 flex items-center gap-3 font-mono text-[13px] text-tinta-suave">
          <button type="button" onClick={() => ir(anterior)} aria-label={textos.anterior} className="px-1 hover:text-acento">
            ‹
          </button>
          <span aria-live="polite">
            {i + 1} / {casos.length}
          </span>
          <button type="button" onClick={() => ir(proximo)} aria-label={textos.proximo} className="px-1 hover:text-acento">
            ›
          </button>
        </div>

        <div key={caso.slug} className="painel-andar">
          <p className="selo mt-5">
            {etiquetas[vitrine.etiqueta]} · {vitrine.detalhe}
          </p>
          <h3 className="mt-4 max-w-[24ch] font-gravura text-[1.6rem] leading-[1.25] sm:text-[1.85rem]">{caso.titulo}</h3>

          {!aberto && (
            <dl className="mt-6 max-w-[52ch] space-y-4 text-[15px] leading-relaxed">
              {(
                [
                  [textos.gargalo, vitrine.gargalo],
                  [textos.resultado, vitrine.resultado],
                ] as const
              ).map(([rotulo, texto]) => (
                <div key={rotulo}>
                  <dt className="font-mono text-[11px] tracking-[0.14em] text-acento uppercase">{rotulo}</dt>
                  <dd className="mt-1.5 text-tinta-suave">{texto}</dd>
                </div>
              ))}
              {/* A stack, numa linha: o suficiente para quem procura a ferramenta. */}
              <p className="font-mono text-[11px] tracking-[0.04em] text-tinta-fraca">
                {caso.stack.slice(0, 6).join(" · ")}
              </p>
            </dl>
          )}

          <div className="mt-7 max-w-[52ch] border-t border-regua pt-4">
            <button
              type="button"
              aria-expanded={aberto}
              onClick={() => setAberto(!aberto)}
              className="text-[15px] text-acento transition-colors hover:text-acento-forte"
            >
              {textos.porTras} {aberto ? "−" : "+"}
            </button>
            {aberto && (
              <div className="painel-andar mt-5 space-y-4">
                {caso.decisoes.map((d, n) =>
                  n === decisao ? (
                    <div key={d.titulo}>
                      <p className="text-lg leading-snug text-tinta">{d.titulo}</p>
                      <dl className="mt-3 space-y-2.5 text-[14px] leading-relaxed">
                        {(
                          [
                            [rotulos.escolha, d.escolha],
                            [rotulos.descartado, d.descartado],
                            [rotulos.custo, d.custo],
                          ] as const
                        ).map(([r, t]) => (
                          <div key={r}>
                            <dt className="font-mono text-[11px] tracking-[0.14em] text-acento uppercase">{r}</dt>
                            <dd className="mt-0.5 text-tinta-suave">{t}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ) : (
                    <button
                      key={d.titulo}
                      type="button"
                      onClick={() => setDecisao(n)}
                      className="block text-left text-[15px] leading-snug text-tinta-suave transition-colors hover:text-tinta"
                    >
                      + {d.titulo}
                    </button>
                  ),
                )}
              </div>
            )}
            <a
              href={`/${idioma}/casos/${caso.slug}`}
              className="mt-5 block font-mono text-xs text-acento transition-colors hover:text-acento-forte"
            >
              {textos.casoCompleto} →
            </a>
          </div>
        </div>

        {/* a régua com todos os sistemas */}
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px]" role="tablist" aria-label={textos.rotulo}>
          {casos.map((c, n) => (
            <button
              key={c.slug}
              type="button"
              role="tab"
              aria-selected={n === i}
              onClick={() => ir(n)}
              className={`border-b-2 pb-1.5 transition-colors ${
                n === i ? "border-acento text-tinta" : "border-transparent text-tinta-fraca hover:text-tinta-suave"
              }`}
            >
              {c.vitrine.curto}
            </button>
          ))}
        </div>
      </div>

      {/* ------------------------------------- o sistema, funcionando */}
      <div key={caso.slug}>
        {caso.slug === "agente-conversacional" && caso.arquitetura && (
          <SimuladorAgente
            textos={textos.agente}
            nos={caso.arquitetura.nos}
            carimbo={carimbo}
            nomes={nomes}
            aoBarrar={abrirDecisao}
          />
        )}
        {caso.slug === "contratos-bancarios" && <PipelineContratos textos={textos.contratos} idioma={idioma} nomes={nomes} />}
        {caso.slug === "ingestao-em-escala" && <LeituraColunar textos={textos.ingestao} nomes={nomes} />}
        {caso.slug === "laudo-enquadramento" && <LaudoGuiado textos={textos.laudo} nomes={nomes} />}
        {caso.slug === "economize-milhas" && (
          <ContaMilhas textos={textos.milhas} idioma={idioma} url={caso.links?.[0]?.url} nomes={nomes} />
        )}
      </div>
    </div>
  );
}
