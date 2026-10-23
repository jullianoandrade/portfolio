import type { Metadata } from "next";
import { IBM_Plex_Mono, Marcellus_SC } from "next/font/google";
import { notFound } from "next/navigation";

import { Revelar } from "@/components/Revelar";
import { BarraPrevia } from "@/components/previa/BarraPrevia";
import { CASOS_PREVIA, PERFIL_PREVIA } from "@/components/previa/dados";
import { MapaMecanico, type Estrutura } from "@/components/previa/MapaMecanico";
import "@/components/previa/mapa.css";

const marcellus = Marcellus_SC({ variable: "--font-marcellus", subsets: ["latin"], weight: "400" });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "Prévia · O Mapa Mecânico",
  robots: { index: false, follow: false },
};

/** Onde cada caso fica no território. As regiões são os domínios. */
const POSICOES: Record<string, { x: number; y: number }> = {
  "agente-conversacional": { x: 215, y: 235 },
  "contratos-bancarios": { x: 475, y: 170 },
  "ingestao-em-escala": { x: 790, y: 210 },
  "laudo-enquadramento": { x: 335, y: 390 },
  "economize-milhas": { x: 640, y: 405 },
};

const ROTAS: [string, string][] = [
  ["agente-conversacional", "contratos-bancarios"],
  ["contratos-bancarios", "ingestao-em-escala"],
  ["agente-conversacional", "laudo-enquadramento"],
  ["laudo-enquadramento", "economize-milhas"],
  ["economize-milhas", "ingestao-em-escala"],
];

export default async function PreviaMapa({
  params,
}: {
  params: Promise<{ idioma: string }>;
}) {
  const { idioma } = await params;
  if (idioma !== "pt") notFound();

  const estruturas: Estrutura[] = CASOS_PREVIA.map((caso) => {
    const posicao = POSICOES[caso.slug];
    if (!posicao) throw new Error(`sem posição no mapa para "${caso.slug}"`);
    return {
      slug: caso.slug,
      ...posicao,
      dominio: caso.dominio,
      valor: caso.destaque.valor,
      rotulo: caso.destaque.rotulo,
    };
  });

  return (
    <div className={`mp ${marcellus.variable} ${plexMono.variable} flex-1`}>
      <BarraPrevia atual="mapa" />

      <div className="mx-auto max-w-6xl px-6">
        <header className="pb-10 pt-16 text-center sm:pt-24">
          <p className="mp-rotulo">{PERFIL_PREVIA.lugar}</p>
          <h1 className="mp-gravado mt-5 text-5xl leading-none text-[var(--mp-latao)] sm:text-7xl">
            {PERFIL_PREVIA.nome}
          </h1>
          <p className="mx-auto mt-6 max-w-[34ch] text-xl leading-snug text-[var(--mp-suave)] sm:text-2xl">
            {PERFIL_PREVIA.frase}
          </p>
          <p className="mp-rotulo mt-6">{PERFIL_PREVIA.sublinha}</p>
        </header>

        <section className="pb-6">
          <p className="mp-rotulo mb-4 text-center">O território · cada sistema se ergue onde resolveu um gargalo</p>
          <MapaMecanico
            estruturas={estruturas}
            rotas={ROTAS}
            titulo="Mapa com os cinco sistemas construídos, um por domínio"
          />
        </section>

        <section className="border-t border-[var(--mp-regua)] py-14">
          <p className="mp-rotulo">As cinco construções</p>
          <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CASOS_PREVIA.map((caso, i) => (
              <li key={caso.slug}>
                <Revelar atraso={i * 60} className="h-full">
                  <article className="h-full border border-[var(--mp-regua)] p-6">
                    <p className="mp-gravado text-sm text-[var(--mp-latao)]">{caso.dominio}</p>
                    <h2 className="mt-2 text-lg font-medium leading-snug">{caso.titulo}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--mp-suave)]">{caso.pedido}</p>
                    <p className="mt-5 font-mono text-sm">
                      <span className="text-[var(--mp-latao)]">{caso.destaque.valor}</span>{" "}
                      <span className="text-[var(--mp-suave)]">{caso.destaque.rotulo}</span>
                    </p>
                  </article>
                </Revelar>
              </li>
            ))}
          </ol>
        </section>

        <footer className="border-t border-[var(--mp-regua)] py-12 text-center">
          <p className="mp-rotulo">A rota até mim</p>
          <a
            href={`mailto:${PERFIL_PREVIA.email}`}
            className="mp-gravado mt-3 inline-block text-2xl text-[var(--mp-latao)] hover:underline"
          >
            {PERFIL_PREVIA.email}
          </a>
        </footer>
      </div>
    </div>
  );
}
