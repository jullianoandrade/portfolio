import Link from "next/link";

import { MUNDOS } from "./dados";

/**
 * Barra fina no topo de cada prévia: diz qual mundo está na tela e leva para os
 * outros. Fica fora do mundo de propósito — é andaime de comparação, não parte
 * do design avaliado.
 */
export function BarraPrevia({ atual }: { atual: (typeof MUNDOS)[number]["slug"] }) {
  return (
    <nav
      aria-label="Prévias"
      className="relative z-30 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-white/10 bg-black/80 px-5 py-2.5 font-mono text-[11px] tracking-wide text-white/60"
    >
      <Link href="/pt/previa" className="text-white/80 hover:text-white">
        ← prévias
      </Link>
      {MUNDOS.map((m) => (
        <Link
          key={m.slug}
          href={`/pt/previa/${m.slug}`}
          aria-current={m.slug === atual ? "page" : undefined}
          className={m.slug === atual ? "text-white" : "hover:text-white"}
        >
          {m.nome}
        </Link>
      ))}
    </nav>
  );
}
