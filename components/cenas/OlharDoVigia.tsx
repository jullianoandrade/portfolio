"use client";

import { useEffect } from "react";

/** Quanto a pupila anda dentro do olho, nas unidades do desenho (o olho tem raio 5). */
const ALCANCE = 2.4;
/** Sem o mouse mexer por esse tempo, ele volta a fazer a ronda sozinho. */
const RONDA_APOS = 2500;

/**
 * O Vigia nunca para de olhar: em todo lugar onde ele aparece (o canto do
 * hero, o trilho, a roda do contato, a própria abertura), a pupila segue o
 * mouse. Parado o mouse, ou no toque, ele volta à ronda, olhando de um lado
 * ao outro (`html.vigia-ronda`, no CSS). Não desenha nada: só mexe nas
 * pupilas que o Familiar já tem.
 */
export function OlharDoVigia() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const html = document.documentElement;
    html.classList.add("vigia-ronda");
    let quadro = 0;
    let parado = 0;
    let alvo: { x: number; y: number } | null = null;

    const olhar = () => {
      quadro = 0;
      if (!alvo) return;
      document.querySelectorAll<SVGCircleElement>(".pupila-vigia").forEach((p) => {
        const olho = p.previousElementSibling?.getBoundingClientRect();
        if (!olho?.width) return;
        const dx = alvo!.x - (olho.left + olho.width / 2);
        const dy = alvo!.y - (olho.top + olho.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        // Longe, a pupila encosta na borda; perto, fica quase no centro.
        const k = Math.min(1, d / 120) * ALCANCE;
        p.style.translate = `${(dx / d) * k}px ${(dy / d) * k}px`;
      });
    };

    const mover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      alvo = { x: e.clientX, y: e.clientY };
      html.classList.remove("vigia-ronda");
      clearTimeout(parado);
      parado = window.setTimeout(() => {
        alvo = null;
        document.querySelectorAll<SVGCircleElement>(".pupila-vigia").forEach((p) => (p.style.translate = ""));
        html.classList.add("vigia-ronda");
      }, RONDA_APOS);
      if (!quadro) quadro = requestAnimationFrame(olhar);
    };
    // Rolando, o que está embaixo do mouse muda: ele acompanha.
    const rolar = () => {
      if (alvo && !quadro) quadro = requestAnimationFrame(olhar);
    };

    addEventListener("pointermove", mover, { passive: true });
    addEventListener("scroll", rolar, { passive: true });
    return () => {
      removeEventListener("pointermove", mover);
      removeEventListener("scroll", rolar);
      cancelAnimationFrame(quadro);
      clearTimeout(parado);
      html.classList.remove("vigia-ronda");
    };
  }, []);

  return null;
}
