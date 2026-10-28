"use client";

import { useState } from "react";

import type { Cenas, Idioma, NomeFamiliar } from "@/conteudo/tipos";
import { Anfitriao } from "./Anfitriao";

/**
 * Contrato de exemplo. Os números são inventados e o rótulo diz isso; a taxa
 * efetiva não: ela é calculada aqui, por código, a partir deles — que é
 * exatamente o argumento do caso.
 */
const CONTRATO = { prazo: 48, financiado: 30000, parcela: 1090 };
/** Referência de exemplo, no lugar da média publicada para a modalidade. */
const REFERENCIA = 1.9;

type Campo = keyof typeof CONTRATO;

/**
 * As linhas da página. `pessoal` é o que a máscara troca por marcador;
 * `campo` é a cláusula de onde o modelo tirou aquele número.
 */
const LINHAS: { largura: number; pessoal?: string; campo?: Campo }[] = [
  { largura: 74 },
  { largura: 52, pessoal: "[PESSOA_1]" },
  { largura: 42, pessoal: "[CPF_1]" },
  { largura: 82 },
  { largura: 88, campo: "financiado" },
  { largura: 70 },
  { largura: 78, campo: "prazo" },
  { largura: 90, campo: "parcela" },
  { largura: 60 },
];

/** Taxa mensal que iguala o valor presente das parcelas ao financiado. */
function taxaMensal({ prazo, financiado, parcela }: typeof CONTRATO) {
  let baixo = 0;
  let alto = 1;
  for (let i = 0; i < 80; i++) {
    const meio = (baixo + alto) / 2;
    const pv = (parcela * (1 - (1 + meio) ** -prazo)) / meio;
    if (pv > financiado) baixo = meio;
    else alto = meio;
  }
  return ((baixo + alto) / 2) * 100;
}

function Pagina({ mascarada, foco }: { mascarada: boolean; foco: Campo }) {
  return (
    <div className="h-full space-y-2.5 border border-regua-forte bg-fundo-elevado p-3">
      {LINHAS.map((l, i) => {
        if (l.pessoal) {
          return mascarada ? (
            <span key={i} className="block w-fit rounded-[2px] bg-acento px-1 font-mono text-[9px] leading-[13px] text-fundo">
              {l.pessoal}
            </span>
          ) : (
            <span key={i} className="block h-[9px] bg-gargalo/70" style={{ width: `${l.largura * 0.8}%` }} />
          );
        }
        const destaque = l.campo === foco;
        return (
          <span
            key={i}
            className={`linha-doc block h-[5px] ${destaque ? "bg-acento-forte outline-1 outline-offset-[4px] outline-acento-forte" : "bg-regua-forte"}`}
            style={{ width: `${l.largura}%`, outlineStyle: destaque ? "solid" : undefined }}
          />
        );
      })}
    </div>
  );
}

export function PipelineContratos({
  textos,
  idioma,
  nomes,
}: {
  textos: Cenas["construi"]["contratos"];
  idioma: Idioma;
  nomes: Record<NomeFamiliar, string>;
}) {
  const [foco, setFoco] = useState<Campo>("parcela");
  const numero = new Intl.NumberFormat(idioma === "pt" ? "pt-BR" : "en-US", { maximumFractionDigits: 2 });
  const porMes = idioma === "pt" ? "a.m." : "/mo";
  const taxa = taxaMensal(CONTRATO);
  const acima = taxa > REFERENCIA;
  const maior = Math.max(taxa, REFERENCIA);

  return (
    <div>
      <div className="border border-regua bg-fundo-afundado p-5 sm:p-6">
        <p className="rotulo !text-[10px]">
          {textos.instrucao} · {textos.ficticio}
        </p>
        <ol className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {textos.passos.map((passo, i) => (
            <li key={passo} className="flex flex-col">
              <p className="mb-2 font-mono text-[10px] tracking-[0.14em] text-acento uppercase">
                {i + 1} · {passo}
              </p>
              <div className="min-h-[190px] flex-1">
                {i === 0 && <Pagina mascarada={false} foco={foco} />}
                {i === 1 && <Pagina mascarada foco={foco} />}
                {i === 2 && (
                  <div className="h-full border border-regua-forte bg-fundo-elevado p-3 font-mono text-[11px] leading-relaxed text-tinta-suave">
                    <p>{"{"}</p>
                    {(Object.keys(CONTRATO) as Campo[]).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onMouseEnter={() => setFoco(c)}
                        onFocus={() => setFoco(c)}
                        onClick={() => setFoco(c)}
                        aria-pressed={foco === c}
                        className={`my-1 block w-full border px-1.5 py-0.5 text-left transition-colors ${
                          foco === c ? "border-acento-forte text-acento-forte" : "border-transparent hover:text-tinta"
                        }`}
                      >
                        {textos.campos[c]}: {numero.format(CONTRATO[c])}
                      </button>
                    ))}
                    <p>{"}"}</p>
                  </div>
                )}
                {i === 3 && (
                  <div className="h-full border border-regua-forte bg-fundo-elevado p-3 font-mono">
                    <p className="text-[10px] text-tinta-fraca">{textos.taxaEfetiva}</p>
                    <p className={`mt-1 text-base whitespace-nowrap ${acima ? "text-gargalo" : "text-acento"}`}>
                      {numero.format(taxa)}% {porMes}
                    </p>
                    <span className={`block h-2 ${acima ? "bg-gargalo" : "bg-acento"}`} style={{ width: `${(taxa / maior) * 100}%` }} />
                    <p className="mt-4 text-[10px] text-tinta-fraca">{textos.mediaPublicada}</p>
                    <p className="mt-1 text-base whitespace-nowrap text-tinta-suave">
                      {numero.format(REFERENCIA)}% {porMes}
                    </p>
                    <span className="block h-2 bg-tinta-fraca" style={{ width: `${(REFERENCIA / maior) * 100}%` }} />
                    <p className={`mt-4 text-[10px] tracking-[0.1em] uppercase ${acima ? "text-gargalo" : "text-acento"}`}>
                      {acima ? textos.acima : textos.dentro}
                    </p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>

      </div>

      <Anfitriao nome="escriba" rotulo={nomes.escriba} fala={textos.fala} className="mt-5" />
    </div>
  );
}
