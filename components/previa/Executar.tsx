"use client";

import { useState } from "react";

/**
 * O estalar de dedos: troca o feed da operação manual pelo sistema rodando.
 *
 * Sem JavaScript, os dois estados aparecem empilhados — o CSS só esconde o
 * sistema quando existe `js-pronto`. O botão é `aria-pressed`, então leitor de
 * tela anuncia o estado, e é alcançável por Tab.
 */
export function Executar({
  rotulo,
  rotuloFeito,
  manual,
  sistema,
}: {
  rotulo: string;
  rotuloFeito: string;
  manual: React.ReactNode;
  sistema: React.ReactNode;
}) {
  const [executado, setExecutado] = useState(false);

  return (
    <div className="sc-executar" data-estado={executado ? "sistema" : "manual"}>
      <div className="sc-manual">{manual}</div>
      <div className="mt-6">
        <button
          type="button"
          className="sc-botao"
          aria-pressed={executado}
          onClick={() => setExecutado((v) => !v)}
        >
          <span aria-hidden>{executado ? "↺" : "▶"}</span>
          {executado ? rotuloFeito : rotulo}
        </button>
      </div>
      <div className="sc-sistema">{sistema}</div>
    </div>
  );
}
