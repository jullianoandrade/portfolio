"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Idioma } from "@/conteudo/tipos";

/**
 * Troca o idioma preservando a rota atual.
 *
 * Trocar de idioma numa página de caso tem que manter a pessoa naquele caso —
 * mandar todo mundo para a home é o jeito mais rápido de fazer alguém desistir
 * de ler. Como o idioma é sempre o primeiro segmento, basta substituí-lo.
 */
export function AlternadorIdioma({
  atual,
  destino,
  rotulo,
}: {
  atual: Idioma;
  destino: Idioma;
  rotulo: string;
}) {
  const caminho = usePathname();
  const segmentos = caminho.split("/");

  // segmentos[0] é vazio (o caminho começa com "/"), segmentos[1] é o idioma
  if (segmentos[1] === atual) segmentos[1] = destino;

  const href = segmentos.join("/") || `/${destino}`;

  return (
    <Link
      href={href}
      hrefLang={destino}
      className="rotulo transition-colors hover:text-acento focus-visible:text-acento"
    >
      {rotulo}
    </Link>
  );
}
