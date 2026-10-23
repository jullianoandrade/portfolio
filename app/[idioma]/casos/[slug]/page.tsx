import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AlternadorIdioma } from "@/components/AlternadorIdioma";
import { DiagramaArquitetura } from "@/components/DiagramaArquitetura";
import { Revelar } from "@/components/Revelar";
import { IDIOMAS, ehIdioma, obterConteudo, outroIdioma } from "@/conteudo";
import { casoPorSlug, formaDoPapel } from "@/conteudo/tipos";

type Parametros = { params: Promise<{ idioma: string; slug: string }> };

/**
 * Só existem os parâmetros gerados em build. Sem isto, um slug inexistente
 * é renderizado dinamicamente e o `notFound()` roda depois do status 200 já
 * ter sido enviado — a página mostra 404 mas responde 200, que é um soft 404
 * e acaba indexado.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  return IDIOMAS.flatMap((idioma) =>
    obterConteudo(idioma).casos.map((caso) => ({ idioma, slug: caso.slug })),
  );
}

export async function generateMetadata({ params }: Parametros): Promise<Metadata> {
  const { idioma, slug } = await params;
  if (!ehIdioma(idioma)) return {};
  const caso = casoPorSlug(obterConteudo(idioma), slug);
  if (!caso) return {};
  return {
    title: `${caso.titulo} — Juliano Andrade`,
    description: caso.resumo,
  };
}

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-regua py-12">
      <Revelar>
        <h2 className="rotulo mb-5">{titulo}</h2>
      </Revelar>
      {children}
    </section>
  );
}

export default async function PaginaCaso({ params }: Parametros) {
  const { idioma, slug } = await params;
  if (!ehIdioma(idioma)) notFound();

  const conteudo = obterConteudo(idioma);
  const caso = casoPorSlug(conteudo, slug);
  if (!caso) notFound();

  const { perfil, interface: ui } = conteudo;
  const outro = outroIdioma(idioma);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-regua bg-fundo/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
          <Link
            href={`/${idioma}#casos`}
            className="rotulo transition-colors hover:text-acento"
          >
            ← {ui.voltar}
          </Link>
          <AlternadorIdioma atual={idioma} destino={outro} rotulo={ui.trocarIdioma} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6">
        <article>
          <div className="py-14 sm:py-20">
            <Revelar>
              <p className="rotulo">
                {caso.dominio} · {caso.periodo}
              </p>
            </Revelar>
            <Revelar atraso={70}>
              <h1 className="mt-4 text-3xl font-semibold leading-[1.12] tracking-tight sm:text-5xl">
                {caso.titulo}
              </h1>
            </Revelar>
            <Revelar atraso={140}>
              <p className="mt-6 text-lg leading-relaxed text-tinta-suave">{caso.resumo}</p>
            </Revelar>
            <Revelar atraso={200}>
              <div className="mt-8 border-l-2 border-acento pl-4">
                <p className="rotulo">
                  {ui.rotulos.papel} · {formaDoPapel(caso.papel, ui)}
                </p>
                <p className="mt-1.5 leading-relaxed text-tinta-suave">
                  {caso.papel.descricao}
                </p>
              </div>
            </Revelar>

            {caso.metricas.length > 0 && (
              <Revelar atraso={260}>
                <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
                  {caso.metricas.map((m) => (
                    <div key={m.rotulo}>
                      <dt className="text-3xl font-semibold tabular-nums text-acento">
                        {m.valor}
                      </dt>
                      <dd className="mt-1 text-xs leading-snug text-tinta-fraca">
                        {m.rotulo}
                        <span className="block text-tinta-fraca/70">
                          {m.periodo}
                          {m.base ? ` · ${m.base}` : ""}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </Revelar>
            )}

            {caso.links && caso.links.length > 0 && (
              <Revelar atraso={320}>
                <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2">
                  {caso.links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline underline-offset-4 hover:text-acento"
                    >
                      {l.rotulo} ↗
                    </a>
                  ))}
                </div>
              </Revelar>
            )}

            {caso.confidencial && (
              <Revelar atraso={360}>
                <p className="mt-9 border-l-2 border-regua-forte pl-4 text-sm leading-relaxed text-tinta-fraca">
                  {ui.notaConfidencialidade}
                </p>
              </Revelar>
            )}
          </div>

          <Bloco titulo={ui.rotulos.problema}>
            <Revelar>
              <p className="text-lg leading-relaxed">{caso.problema}</p>
            </Revelar>
          </Bloco>

          <Bloco titulo={ui.rotulos.restricoes}>
            <ul className="space-y-4">
              {caso.restricoes.map((r, i) => (
                <Revelar key={i} atraso={i * 60}>
                  <li className="flex gap-3 leading-relaxed text-tinta-suave">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-acento" aria-hidden />
                    <span>{r}</span>
                  </li>
                </Revelar>
              ))}
            </ul>
          </Bloco>

          {caso.arquitetura && (
            <Bloco titulo={ui.rotulos.arquitetura}>
              <DiagramaArquitetura
                diagramaId={caso.arquitetura.diagramaId}
                nos={caso.arquitetura.nos}
                legenda={caso.arquitetura.legenda}
                titulo={`${ui.rotulos.arquitetura} — ${caso.titulo}`}
              />
            </Bloco>
          )}

          <Bloco titulo={ui.rotulos.decisoes}>
            <div className="space-y-10">
              {caso.decisoes.map((d, i) => (
                <Revelar key={i} atraso={i * 60}>
                  <div>
                    <h3 className="text-lg font-semibold leading-snug tracking-tight">
                      {d.titulo}
                    </h3>
                    <dl className="mt-4 space-y-3 border-l-2 border-regua pl-4">
                      <div className="grid gap-1 sm:grid-cols-[6rem_1fr] sm:gap-4">
                        <dt className="rotulo pt-0.5">{ui.rotulos.escolha}</dt>
                        <dd className="leading-relaxed text-tinta-suave">{d.escolha}</dd>
                      </div>
                      <div className="grid gap-1 sm:grid-cols-[6rem_1fr] sm:gap-4">
                        <dt className="rotulo pt-0.5">{ui.rotulos.descartado}</dt>
                        <dd className="leading-relaxed text-tinta-suave">{d.descartado}</dd>
                      </div>
                      <div className="grid gap-1 sm:grid-cols-[6rem_1fr] sm:gap-4">
                        <dt className="rotulo pt-0.5">{ui.rotulos.custo}</dt>
                        <dd className="leading-relaxed text-tinta-suave">{d.custo}</dd>
                      </div>
                    </dl>
                  </div>
                </Revelar>
              ))}
            </div>
          </Bloco>

          <Bloco titulo={ui.rotulos.resultado}>
            <ul className="space-y-4">
              {caso.resultado.map((r, i) => (
                <Revelar key={i} atraso={i * 60}>
                  <li className="leading-relaxed text-tinta-suave">{r}</li>
                </Revelar>
              ))}
            </ul>
          </Bloco>

          <Bloco titulo={ui.rotulos.aprendizado}>
            <Revelar>
              <p className="text-lg leading-relaxed">{caso.aprendizado}</p>
            </Revelar>
          </Bloco>

          <Bloco titulo={ui.rotulos.stack}>
            <Revelar>
              <ul className="flex flex-wrap gap-2">
                {caso.stack.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-regua px-3 py-1 font-mono text-xs text-tinta-suave"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </Revelar>
          </Bloco>
        </article>

        <div className="border-t border-regua py-12">
          <Link
            href={`/${idioma}#casos`}
            className="text-sm underline underline-offset-4 hover:text-acento"
          >
            ← {ui.voltar}
          </Link>
        </div>
      </main>

      <footer className="border-t border-regua py-8">
        <div className="mx-auto max-w-3xl px-6">
          <p className="rotulo">
            {perfil.nome} · {perfil.titulo}
          </p>
        </div>
      </footer>
    </>
  );
}
