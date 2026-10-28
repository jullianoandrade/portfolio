"use client";

/**
 * Toca a abertura outra vez. Quem toca é `Abertura`, que escuta o evento —
 * assim este botão não precisa conhecer a cena.
 */
export function VerDeNovo({ rotulo }: { rotulo: string }) {
  return (
    <button
      type="button"
      className="ver-de-novo underline decoration-regua-forte underline-offset-4 transition-colors hover:text-acento"
      onClick={() => window.dispatchEvent(new Event("abertura:tocar"))}
    >
      {rotulo} ↺
    </button>
  );
}
