import Link from "next/link";
import { notFound } from "next/navigation";

import { AlternadorIdioma } from "@/components/AlternadorIdioma";
import { Revelar } from "@/components/Revelar";
import { IDIOMAS, ehIdioma, obterConteudo, outroIdioma } from "@/conteudo";
import { casoDestaque, formaDoPapel } from "@/conteudo/tipos";

function Secao({
  numero,
  titulo,
  id,
  children,
}: {
  numero: string;
  titulo: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-regua py-16 sm:py-24">
      <Revelar>
        <p className="rotulo mb-3">
          {numero} — {titulo}
        </p>
      </Revelar>
      {children}
    </section>
  );
}

/**
 * Só existem os parâmetros gerados em build. Sem isto, um slug inexistente
 * é renderizado dinamicamente e o `notFound()` roda depois do status 200 já
 * ter sido enviado — a página mostra 404 mas responde 200, que é um soft 404
 * e acaba indexado.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  return IDIOMAS.map((idioma) => ({ idioma }));
}

export default async function Home({ params }: { params: Promise<{ idioma: string }> }) {
  const { idioma } = await params;
  if (!ehIdioma(idioma)) notFound();

  const conteudo = obterConteudo(idioma);
  const { perfil, interface: ui, capacidades, casos } = conteudo;
  const destaque = casoDestaque(conteudo);
  const demais = casos.filter((c) => c.slug !== destaque.slug);
  const outro = outroIdioma(idioma);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-regua bg-fundo/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Link href={`/${idioma}`} className="text-sm font-semibold tracking-tight">
            {perfil.nome}
          </Link>
          <nav className="flex items-center gap-5">
            <a href="#sobre" className="rotulo hidden transition-colors hover:text-acento sm:block">
              {ui.navegacao.sobre}
            </a>
            <a href="#casos" className="rotulo hidden transition-colors hover:text-acento sm:block">
              {ui.navegacao.casos}
            </a>
            <a href="#contato" className="rotulo hidden transition-colors hover:text-acento sm:block">
              {ui.navegacao.contato}
            </a>
            <AlternadorIdioma atual={idioma} destino={outro} rotulo={ui.trocarIdioma} />
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6">
        {/* ---------------------------------------------------------- hero */}
        <section className="py-20 sm:py-32">
          <Revelar>
            <p className="rotulo mb-5">
              {perfil.titulo} · {perfil.localizacao}
            </p>
          </Revelar>
          <Revelar atraso={80}>
            <h1 className="max-w-[18ch] text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
              {ui.heroChamada}
            </h1>
          </Revelar>
          <Revelar atraso={160}>
            <p className="mt-7 max-w-[62ch] text-lg leading-relaxed text-tinta-suave">
              {ui.heroSubtitulo}
            </p>
          </Revelar>
          <Revelar atraso={240}>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={`/${idioma}/casos/${destaque.slug}`}
                className="rounded-[--borda-raio] bg-acento px-5 py-3 text-sm font-medium text-fundo transition-opacity hover:opacity-90"
              >
                {ui.verCaso}
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-tinta-fraca">
                <span className="size-1.5 rounded-full bg-acento" aria-hidden />
                {perfil.disponibilidade}
              </span>
            </div>
          </Revelar>
        </section>

        {/* --------------------------------------------------------- sobre */}
        <Secao numero="01" titulo={ui.navegacao.sobre} id="sobre">
          <div className="max-w-[68ch] space-y-5">
            {perfil.arco.map((paragrafo, i) => (
              <Revelar key={i} atraso={i * 70}>
                <p
                  className={
                    i === 0
                      ? "text-xl leading-relaxed sm:text-2xl"
                      : "text-base leading-relaxed text-tinta-suave"
                  }
                >
                  {paragrafo}
                </p>
              </Revelar>
            ))}
          </div>
        </Secao>

        {/* --------------------------------------------------- capacidades */}
        <Secao numero="02" titulo={ui.navegacao.capacidades}>
          <div className="grid gap-px overflow-hidden rounded-[--borda-raio] border border-regua bg-regua sm:grid-cols-2">
            {capacidades.map((cap, i) => (
              <Revelar key={cap.id} atraso={i * 60}>
                <div className="flex h-full flex-col bg-fundo p-6 sm:p-7">
                  <h3 className="text-base font-semibold tracking-tight">{cap.titulo}</h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-tinta-suave">
                    {cap.descricao}
                  </p>
                  {/* Cada capacidade aponta os casos que a demonstram: é o que
                      faz a organização por capacidade valer alguma coisa, em
                      vez de ser só um título bonito acima de uma descrição. */}
                  <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
                    {cap.casos.map((slug) => {
                      const caso = casos.find((c) => c.slug === slug);
                      if (!caso) return null;
                      return (
                        <li key={slug}>
                          <Link
                            href={`/${idioma}/casos/${slug}`}
                            className="rotulo underline decoration-regua-forte underline-offset-4 transition-colors hover:text-acento"
                          >
                            {caso.dominio}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Revelar>
            ))}
          </div>
        </Secao>

        {/* --------------------------------------------------------- casos */}
        <Secao numero="03" titulo={ui.navegacao.casos} id="casos">
          <Revelar>
            <Link
              href={`/${idioma}/casos/${destaque.slug}`}
              className="group block rounded-[--borda-raio] border border-regua-forte p-7 transition-colors hover:border-acento sm:p-10"
            >
              <p className="rotulo">
                {destaque.dominio} · {destaque.periodo}
              </p>
              <h3 className="mt-4 max-w-[24ch] text-2xl font-semibold leading-tight tracking-tight transition-colors group-hover:text-acento sm:text-3xl">
                {destaque.titulo}
              </h3>
              <p className="mt-4 max-w-[64ch] leading-relaxed text-tinta-suave">
                {destaque.resumo}
              </p>
              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
                {destaque.metricas.map((m) => (
                  <div key={m.rotulo}>
                    <dt className="text-2xl font-semibold tabular-nums text-acento">{m.valor}</dt>
                    <dd className="mt-0.5 text-xs text-tinta-fraca">
                      {m.rotulo}
                      <span className="block text-tinta-fraca/70">{m.periodo}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Link>
          </Revelar>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {demais.map((caso, i) => (
              <Revelar key={caso.slug} atraso={i * 70}>
                <Link
                  href={`/${idioma}/casos/${caso.slug}`}
                  className="group flex h-full flex-col rounded-[--borda-raio] border border-regua p-6 transition-colors hover:border-acento"
                >
                  <p className="rotulo">
                    {caso.dominio} · {caso.periodo}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-acento">
                    {caso.titulo}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-tinta-suave">
                    {caso.resumo}
                  </p>
                  <p className="rotulo mt-5">{formaDoPapel(caso.papel, ui)}</p>
                </Link>
              </Revelar>
            ))}
          </div>
        </Secao>

        {/* ---------------------------------------------------- trajetória */}
        <Secao numero="04" titulo={perfil.titulo}>
          <ol className="max-w-[68ch] space-y-8">
            {perfil.trajetoria.map((etapa, i) => (
              <Revelar key={i} atraso={i * 70}>
                <li className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-6">
                  <p className="rotulo pt-1">{etapa.periodo}</p>
                  <div>
                    <h3 className="font-semibold tracking-tight">
                      {etapa.cargo}
                      <span className="font-normal text-tinta-fraca"> · {etapa.organizacao}</span>
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-tinta-suave">
                      {etapa.descricao}
                    </p>
                  </div>
                </li>
              </Revelar>
            ))}
          </ol>
        </Secao>

        {/* ------------------------------------------------------- contato */}
        <Secao numero="05" titulo={ui.navegacao.contato} id="contato">
          <Revelar>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <a href={`mailto:${perfil.email}`} className="text-lg underline-offset-4 hover:text-acento hover:underline">
                {perfil.email}
              </a>
              <a
                href={perfil.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-lg underline-offset-4 hover:text-acento hover:underline"
              >
                LinkedIn
              </a>
              <a
                href={perfil.github}
                target="_blank"
                rel="noreferrer"
                className="text-lg underline-offset-4 hover:text-acento hover:underline"
              >
                GitHub
              </a>
            </div>
          </Revelar>
        </Secao>
      </main>

      <footer className="border-t border-regua py-8">
        <div className="mx-auto max-w-5xl px-6">
          {/* Sem ano: um número que envelhece sozinho só serve para denunciar
              abandono, e forçaria render dinâmico só para isso. */}
          <p className="rotulo">
            {perfil.nome} · {perfil.titulo} · {perfil.localizacao}
          </p>
        </div>
      </footer>
    </>
  );
}
