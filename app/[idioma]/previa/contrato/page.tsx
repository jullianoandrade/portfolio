import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import { notFound } from "next/navigation";

import { Revelar } from "@/components/Revelar";
import { BarraPrevia } from "@/components/previa/BarraPrevia";
import { CASOS_PREVIA, PERFIL_PREVIA } from "@/components/previa/dados";
import { Sentido } from "@/components/previa/Sentido";
import "@/components/previa/contrato.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prévia · O Contrato",
  robots: { index: false, follow: false },
};

export default async function PreviaContrato({
  params,
}: {
  params: Promise<{ idioma: string }>;
}) {
  const { idioma } = await params;
  if (idioma !== "pt") notFound();

  return (
    <div className={`ct ${fraunces.variable} flex-1`}>
      <svg className="ct-textura" aria-hidden>
        <filter id="ct-papel">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ct-papel)" />
      </svg>

      <BarraPrevia atual="contrato" />

      <div className="relative z-[2] mx-auto max-w-5xl px-6">
        <header className="pb-16 pt-20 sm:pt-28">
          <Revelar>
            <p className="ct-rotulo">Livro de contratos · {PERFIL_PREVIA.lugar}</p>
          </Revelar>
          <Revelar atraso={80}>
            <h1 className="ct-serif mt-5 text-5xl font-medium leading-[1.02] tracking-tight sm:text-7xl">
              {PERFIL_PREVIA.nome}
            </h1>
          </Revelar>
          <Revelar atraso={160}>
            <p className="ct-serif mt-6 max-w-[30ch] text-2xl leading-snug text-[var(--ct-suave)] sm:text-3xl">
              {PERFIL_PREVIA.frase}
            </p>
          </Revelar>
          <Revelar atraso={220}>
            <p className="ct-rotulo mt-6">{PERFIL_PREVIA.sublinha}</p>
          </Revelar>
        </header>

        <div className="border-t border-[var(--ct-regua)] pt-10">
        <Sentido ligar="Acionar o sentido" desligar="Apagar o sentido">
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="ct-rotulo">Contratos resolvidos</p>
              <p className="ct-serif mt-2 max-w-[44ch] text-lg text-[var(--ct-suave)]">
                Cada um chegou como um gargalo. Passe o mouse num contrato — ou acione o
                sentido — para ver o que estava escondido.
              </p>
            </div>
          </div>

          <ol className="mt-8 grid gap-5 pb-20 md:grid-cols-2">
            {CASOS_PREVIA.map((caso, i) => (
              <li key={caso.slug}>
                <Revelar atraso={i * 70} className="h-full">
                  <article className="ct-ficha h-full" tabIndex={0}>
                    <p className="ct-rotulo">
                      Contrato nº {String(i + 1).padStart(2, "0")} · {caso.dominio}
                    </p>
                    <h2 className="ct-serif mt-3 text-xl font-medium leading-snug">{caso.titulo}</h2>

                    <p className="ct-rotulo mt-6">O pedido</p>
                    <p className="ct-serif ct-pedido mt-2 leading-relaxed">“{caso.pedido}”</p>

                    <p className="ct-rotulo mt-6">O que eu enxerguei</p>
                    <p className="mt-2 text-sm leading-relaxed">
                      <span className="ct-rotulo mr-2">agora</span>
                      <span className="ct-rastro">{caso.agora}</span>
                    </p>
                    <div className="ct-lafrente mt-3 text-sm leading-relaxed">
                      <span className="ct-rotulo">lá na frente</span>
                      {caso.laFrente.map((item) => (
                        <span key={item} className="ct-rastro">
                          — {item}
                        </span>
                      ))}
                    </div>

                    <footer className="mt-7 flex items-center gap-4 border-t border-[var(--ct-regua)] pt-5">
                      <span className="ct-selo">Resolvido</span>
                      <span className="text-sm text-[var(--ct-suave)]">
                        <strong className="ct-serif mr-1.5 text-xl font-medium text-[var(--ct-tinta)]">
                          {caso.destaque.valor}
                        </strong>
                        {caso.destaque.rotulo}
                      </span>
                    </footer>
                  </article>
                </Revelar>
              </li>
            ))}
          </ol>
        </Sentido>
        </div>

        <footer className="border-t border-[var(--ct-regua)] py-14">
          <p className="ct-rotulo">Abrir um contrato</p>
          <a
            href={`mailto:${PERFIL_PREVIA.email}`}
            className="ct-serif mt-3 inline-block text-2xl underline decoration-[var(--ct-regua)] underline-offset-[6px] hover:text-[var(--ct-brasa)]"
          >
            {PERFIL_PREVIA.email}
          </a>
        </footer>
      </div>
    </div>
  );
}
