import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";

import { DiagramaArquitetura } from "@/components/DiagramaArquitetura";
import { Revelar } from "@/components/Revelar";
import { BarraPrevia } from "@/components/previa/BarraPrevia";
import { CASOS_PREVIA, PERFIL_PREVIA } from "@/components/previa/dados";
import { Executar } from "@/components/previa/Executar";
import "@/components/previa/scanner.css";
import { pt } from "@/conteudo/pt";
import { casoPorSlug } from "@/conteudo/tipos";

const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prévia · O Scanner",
  robots: { index: false, follow: false },
};

export default async function PreviaScanner({
  params,
}: {
  params: Promise<{ idioma: string }>;
}) {
  const { idioma } = await params;
  if (idioma !== "pt") notFound();

  const agente = casoPorSlug(pt, "agente-conversacional");
  const arquitetura = agente?.arquitetura;

  return (
    <div className={`sc ${jetbrains.variable} flex-1`}>
      <BarraPrevia atual="scanner" />

      <div className="mx-auto max-w-5xl px-6">
        <header className="pb-12 pt-16 sm:pt-24">
          <p className="sc-rotulo">
            ◢ {PERFIL_PREVIA.nome} {"//"} {PERFIL_PREVIA.lugar}
          </p>
          <h1 className="mt-5 max-w-[22ch] text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            {PERFIL_PREVIA.frase}
          </h1>
          <p className="sc-rotulo mt-6">{PERFIL_PREVIA.sublinha}</p>
        </header>

        <section aria-labelledby="sc-feed-titulo" className="pb-16">
          <Executar
            rotulo="Executar"
            rotuloFeito="Ver a operação manual de novo"
            manual={
              <div className="sc-moldura sc-feed">
                <div className="sc-varredura" aria-hidden />
                <div className="flex items-center justify-between">
                  <p id="sc-feed-titulo" className="sc-rotulo">
                    Feed {"//"} operação manual
                  </p>
                  <p className="sc-rotulo">varredura · 5 gargalos</p>
                </div>
                <ol className="mt-5 space-y-4">
                  {CASOS_PREVIA.map((caso, i) => (
                    <li key={caso.slug} className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-5">
                      <span className="sc-rotulo pt-0.5">{caso.dominio}</span>
                      <span>
                        <span className="sc-linha block leading-relaxed">{caso.pedido}</span>
                        <span
                          className="sc-anota sc-mono mt-1 block text-xs"
                          style={{ "--i": i } as React.CSSProperties}
                        >
                          ▸ gargalo detectado: {caso.agora}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            }
            sistema={
              <div className="mt-6 space-y-6">
                <div className="sc-moldura">
                  <p className="sc-rotulo">Sistema {"//"} em produção</p>
                  <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-3">
                    {CASOS_PREVIA.map((caso) => (
                      <div key={caso.slug}>
                        <dt className="sc-mono text-2xl text-[var(--sc-sinal)]">{caso.destaque.valor}</dt>
                        <dd className="mt-1 text-xs text-[var(--sc-suave)]">
                          {caso.destaque.rotulo}
                          <span className="sc-rotulo mt-0.5 block">{caso.dominio}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
                {arquitetura ? (
                  <div className="sc-moldura">
                    <p className="sc-rotulo">Arquitetura {"//"} agente conversacional</p>
                    <DiagramaArquitetura
                      diagramaId={arquitetura.diagramaId}
                      nos={arquitetura.nos}
                      legenda={arquitetura.legenda}
                      titulo="Arquitetura do agente conversacional"
                    />
                  </div>
                ) : null}
              </div>
            }
          />
        </section>

        <section className="border-t border-[var(--sc-regua)] py-14">
          <p className="sc-rotulo">Alvos resolvidos</p>
          <ol className="mt-6 space-y-3">
            {CASOS_PREVIA.map((caso, i) => (
              <li key={caso.slug}>
                <Revelar atraso={i * 60}>
                  <article className="sc-moldura grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <p className="sc-rotulo">
                        alvo {String(i + 1).padStart(2, "0")} · {caso.dominio}
                      </p>
                      <h2 className="mt-1.5 text-lg font-semibold leading-snug">{caso.titulo}</h2>
                      <div className="sc-barra mt-3" aria-hidden>
                        <span />
                      </div>
                    </div>
                    <p className="sc-mono text-right text-sm">
                      <span className="text-xl text-[var(--sc-sinal)]">{caso.destaque.valor}</span>
                      <span className="block text-xs text-[var(--sc-suave)]">{caso.destaque.rotulo}</span>
                    </p>
                  </article>
                </Revelar>
              </li>
            ))}
          </ol>
        </section>

        <footer className="border-t border-[var(--sc-regua)] py-12">
          <p className="sc-rotulo">Canal aberto</p>
          <a
            href={`mailto:${PERFIL_PREVIA.email}`}
            className="sc-mono mt-3 inline-block text-xl text-[var(--sc-sinal)] hover:underline"
          >
            {PERFIL_PREVIA.email}
          </a>
        </footer>
      </div>
    </div>
  );
}
