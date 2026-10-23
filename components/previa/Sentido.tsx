"use client";

import { useEffect, useRef, useState } from "react";

/**
 * O Sentido: liga e desliga a revelação dos rastros escondidos.
 *
 * O estado vive num atributo (`data-sentido`) e quem revela é o CSS em
 * `contrato.css`. Além do botão, no mouse existe um holofote que acompanha o
 * ponteiro — é o único JavaScript que segue o cursor, e por isso:
 *
 *   - só liga em `(pointer: fine)`: no toque não há cursor a seguir;
 *   - não liga com `prefers-reduced-motion`;
 *   - atualiza no máximo uma vez por quadro (`requestAnimationFrame`), em vez
 *     de a cada evento — o bug de "lente colada demais no cursor" que o Samuel
 *     relatou no log dele vem justamente de não limitar isso.
 */
export function Sentido({
  ligar,
  desligar,
  children,
}: {
  ligar: string;
  desligar: string;
  children: React.ReactNode;
}) {
  const [ligado, setLigado] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raiz = ref.current;
    if (!raiz) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let quadro = 0;
    let x = 0;
    let y = 0;
    const aoMover = (evento: PointerEvent) => {
      x = evento.clientX;
      y = evento.clientY;
      if (quadro) return;
      quadro = requestAnimationFrame(() => {
        quadro = 0;
        raiz.style.setProperty("--x", `${x}px`);
        raiz.style.setProperty("--y", `${y}px`);
      });
    };

    window.addEventListener("pointermove", aoMover, { passive: true });
    return () => {
      window.removeEventListener("pointermove", aoMover);
      cancelAnimationFrame(quadro);
    };
  }, []);

  return (
    <div ref={ref} className="ct-sentido" data-sentido={ligado ? "on" : "off"}>
      <div className="ct-holofote" aria-hidden />
      <button
        type="button"
        className="ct-botao"
        aria-pressed={ligado}
        onClick={() => setLigado((v) => !v)}
      >
        <span className="ct-olho" aria-hidden>
          ◉
        </span>
        {ligado ? desligar : ligar}
      </button>
      {children}
    </div>
  );
}
