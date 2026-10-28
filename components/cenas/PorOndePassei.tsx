"use client";

import { useState } from "react";

import { Familiar } from "@/components/abertura/Familiar";
import type { Cenas, NomeFamiliar } from "@/conteudo/tipos";
import { Anfitriao } from "./Anfitriao";
import { hashDoSistema } from "./endereco";

/** Altura de um andar, em px: a cabine do elevador anda de andar em andar. */
const ANDAR = 96;

/**
 * Cena 2. O Grupo Studio em corte, um andar por setor, de baixo (onde ele
 * começou) para cima (onde está hoje). Escolher um andar sobe a cabine com
 * ele dentro e abre o painel do que mudou ali. Logo abaixo do prédio, numa
 * faixa só, o que ele construiu por conta própria.
 */
export function PorOndePassei({
  textos,
  nomes,
}: {
  textos: Cenas["passei"];
  nomes: Record<NomeFamiliar, string>;
}) {
  // De cima para baixo, como o prédio se desenha.
  const andares = [...textos.setores].reverse();
  const [ativo, setAtivo] = useState("operacional");
  // O convite fica até o visitante escolher um andar; depois, fala do andar.
  const [escolheu, setEscolheu] = useState(false);
  function escolher(id: string) {
    setAtivo(id);
    setEscolheu(true);
  }

  const setor = andares.find((s) => s.id === ativo) ?? andares[0];
  const nivel = andares.indexOf(setor);

  return (
    <div>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] xl:grid-cols-[minmax(0,15.5rem)_27rem_minmax(0,1fr)] xl:gap-9">
        {/* ------------------------------------------------------ o texto */}
        <div className="lg:col-span-2 xl:col-span-1">
          <p className="rotulo !text-acento">{textos.empresa}</p>
          <h2 className="mt-5 font-gravura text-4xl leading-[1.15] sm:text-[2.6rem] xl:text-[1.95rem] xl:whitespace-nowrap">
            {textos.titulo[0]}
            <br />
            {textos.titulo[1]}
          </h2>
          <p className="mt-6 max-w-[34ch] text-base leading-relaxed text-tinta-suave">{textos.texto}</p>
          <Anfitriao
            nome="mensageiro"
            rotulo={nomes.mensageiro}
            fala={[escolheu ? setor.fala : textos.convite]}
            className="mt-10 hidden xl:flex"
          />
        </div>

        {/* ------------------------------------------------------- o prédio */}
        <div>
          <div className="predio-telhado mx-[-10px]" aria-hidden />
          <div className="relative grid grid-cols-[3rem_minmax(0,1fr)] border-b border-regua-forte">
            {/* o poço do elevador, com você dentro */}
            <div className="relative border border-regua-forte bg-fundo-afundado" aria-hidden>
              <span className="absolute inset-y-0 left-3 w-px bg-regua" />
              <span className="absolute inset-y-0 right-3 w-px bg-regua" />
              <span
                className="cabine absolute inset-x-1 flex items-end justify-center border border-acento bg-fundo-elevado"
                style={{ top: nivel * ANDAR + 8, height: ANDAR - 16 }}
              >
                <span className="sprite-juliano block h-16" />
              </span>
            </div>

            <ol>
              {andares.map((s) => {
                const ehAtivo = s.id === ativo;
                return (
                  <li
                    key={s.id}
                    data-ativo={ehAtivo}
                    className="andar relative -mt-px flex cursor-pointer flex-col justify-center gap-2.5 border border-regua-forte bg-fundo-elevado px-4 first:mt-0"
                    style={{ height: ANDAR }}
                    onClick={() => escolher(s.id)}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-pressed={ehAtivo}
                        onClick={() => escolher(s.id)}
                        className={`font-gravura text-lg transition-colors ${ehAtivo ? "text-acento-forte" : "text-tinta-suave hover:text-tinta"}`}
                      >
                        {s.nome}
                      </button>
                      {s.marco && (
                        <span
                          className={`rounded-[3px] px-1.5 py-px font-mono text-[10px] tracking-[0.14em] uppercase ${
                            s.marco === "hoje" ? "bg-acento text-fundo" : "border border-tinta-fraca text-tinta-fraca"
                          }`}
                        >
                          {textos.marcos[s.marco]}
                        </span>
                      )}
                    </div>
                    <ul className="flex flex-wrap gap-1.5 xl:flex-nowrap">
                      {s.sistemas.map((sis) => {
                        const classe = `block rounded-[3px] border px-2 py-1 font-mono text-[10.5px] whitespace-nowrap ${
                          ehAtivo ? "border-acento text-tinta" : "border-regua-forte text-tinta-suave"
                        }`;
                        return (
                          <li key={sis.nome}>
                            {sis.caso ? (
                              <a href={hashDoSistema(sis.caso)} className={`${classe} hover:border-acento-forte hover:text-acento-forte`}>
                                {sis.nome} ↗
                              </a>
                            ) : (
                              <span className={classe}>{sis.nome}</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                    {s.agente && (
                      <Familiar
                        nome={s.agente}
                        className={`absolute top-3 right-3 size-7 transition-opacity ${ehAtivo ? "familiar-vivo opacity-100" : "opacity-60"}`}
                      />
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* ------------------------------------------ o andar aberto e o lado de fora */}
        <div className="space-y-6">
          <div key={setor.id} className="painel-andar border border-acento bg-fundo-elevado p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <p className="rotulo !text-acento">{setor.nome}</p>
              {setor.etiqueta && <span className="selo">{textos.etiquetas[setor.etiqueta]}</span>}
            </div>
            <h3 className="mt-4 font-gravura text-2xl leading-snug">{setor.titulo}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-tinta-suave">{setor.descricao}</p>
            {setor.resultados.length > 0 && (
              <dl className="mt-6 grid grid-cols-2 gap-5">
                {setor.resultados.map((r) => (
                  <div key={r.valor}>
                    <dt className="font-mono text-3xl text-acento">{r.valor}</dt>
                    <dd className="mt-1 text-[13px] leading-snug text-tinta">{r.rotulo}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>


          <Anfitriao
            nome="mensageiro"
            rotulo={nomes.mensageiro}
            fala={[escolheu ? setor.fala : textos.convite]}
            className="xl:hidden"
          />
        </div>
      </div>

      {/* ------------------------------------------- por conta própria */}
      <div className="mt-10 flex flex-col gap-4 border-t border-regua pt-6 sm:flex-row sm:items-center sm:gap-8">
        <p className="rotulo shrink-0 !text-acento">{textos.porConta}</p>
        <ul className="flex flex-wrap gap-3">
          {textos.proprios.map((p) => (
            <li key={p.caso}>
              <a
                href={hashDoSistema(p.caso)}
                className="group flex items-baseline gap-3 border border-regua-forte bg-fundo-elevado px-4 py-2.5 transition-colors hover:border-acento"
              >
                <span className="font-gravura text-[15px] text-tinta transition-colors group-hover:text-acento-forte">
                  {p.sistema} ↗
                </span>
                <span className="rotulo">{p.nota}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
