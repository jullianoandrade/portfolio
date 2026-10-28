"use client";

import { useState } from "react";

import type { Cenas, Idioma, NomeFamiliar } from "@/conteudo/tipos";
import { Anfitriao } from "./Anfitriao";

/** Valores de partida, só para a conta já aparecer feita. */
const INICIAL = { preco: 1200, milhas: 40000, taxas: 60, milheiro: 20 };
type Campo = keyof typeof INICIAL;

/**
 * A pergunta do Economize Milhas, em versão de bolso: o mesmo voo pelo mesmo
 * preço muda de resposta conforme o custo por milheiro de quem pergunta.
 */
export function ContaMilhas({
  textos,
  idioma,
  url,
  nomes,
}: {
  textos: Cenas["construi"]["milhas"];
  idioma: Idioma;
  url?: string;
  nomes: Record<NomeFamiliar, string>;
}) {
  const [v, setV] = useState(INICIAL);
  const real = new Intl.NumberFormat(idioma === "pt" ? "pt-BR" : "en-US", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

  const emMilhas = (v.milhas / 1000) * v.milheiro + v.taxas;
  const emDinheiro = v.preco;
  const vaiDeMilhas = emMilhas < emDinheiro;
  const maior = Math.max(emMilhas, emDinheiro, 1);

  const campos: [Campo, string, number][] = [
    ["preco", textos.preco, 50],
    ["milhas", textos.milhas, 1000],
    ["taxas", textos.taxas, 10],
    ["milheiro", textos.milheiro, 1],
  ];

  return (
    <div>
      <div className="border border-regua bg-fundo-afundado p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {campos.map(([campo, rotulo, passo]) => (
            <label key={campo} className="block">
              <span className="font-mono text-[10px] tracking-[0.14em] text-tinta-fraca uppercase">{rotulo}</span>
              <input
                type="number"
                min={0}
                step={passo}
                value={v[campo]}
                onChange={(e) => setV({ ...v, [campo]: Math.max(0, Number(e.target.value) || 0) })}
                className={`mt-1.5 block w-full border bg-fundo px-3 py-2 font-mono text-sm text-tinta outline-none focus:border-acento ${
                  campo === "milheiro" ? "border-acento" : "border-regua-forte"
                }`}
              />
            </label>
          ))}
        </div>

        <div className="mt-7 space-y-4" aria-live="polite">
          {(
            [
              [textos.emMilhas, emMilhas, vaiDeMilhas],
              [textos.emDinheiro, emDinheiro, !vaiDeMilhas],
            ] as const
          ).map(([rotulo, valor, vence]) => (
            <div key={rotulo}>
              <div className="flex justify-between font-mono text-xs">
                <span className={vence ? "text-acento-forte" : "text-tinta-suave"}>{rotulo}</span>
                <span className={vence ? "text-acento-forte" : "text-tinta-suave"}>{real.format(valor)}</span>
              </div>
              <div className="mt-1.5 h-2.5 border border-regua-forte bg-fundo">
                <span
                  className="barra-memoria block h-full"
                  style={{ width: `${(valor / maior) * 100}%`, background: vence ? "#c9a45c" : "#6f747a" }}
                />
              </div>
            </div>
          ))}
          <p className="pt-1 font-gravura text-xl text-tinta">
            {vaiDeMilhas ? textos.vereditoMilhas : textos.vereditoDinheiro}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-regua pt-4">
          <p className="font-mono text-[11px] text-tinta-fraca">{textos.nota}</p>
          {url && (
            <a href={url} target="_blank" rel="noreferrer" className="font-mono text-xs text-acento hover:text-acento-forte">
              {textos.verNoAr} ↗
            </a>
          )}
        </div>
      </div>

      <Anfitriao nome="mensageiro" rotulo={nomes.mensageiro} fala={textos.fala} className="mt-5" />
    </div>
  );
}
