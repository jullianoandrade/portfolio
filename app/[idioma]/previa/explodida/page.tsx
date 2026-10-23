import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { notFound } from "next/navigation";

import { Revelar } from "@/components/Revelar";
import { BarraPrevia } from "@/components/previa/BarraPrevia";
import { CASOS_PREVIA, PERFIL_PREVIA } from "@/components/previa/dados";
import "@/components/previa/explodida.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Prévia · A Vista Explodida",
  robots: { index: false, follow: false },
};

/**
 * Peças do agente conversacional. `k` é a posição na pilha montada (-2 a 2); o
 * deslocamento real sai de `k × altura da peça` no CSS, então mudar a altura no
 * celular não volta a sobrepor as peças. `d*` é a posição explodida, em
 * unidades do contêiner (cqw/cqh), para valer do celular ao monitor largo.
 */
const PECAS = [
  {
    nome: "webhook",
    funcao: "responde na hora; o modelo roda em segundo plano",
    k: -2, dx: "-27cqw", dy: "-30cqh",
  },
  {
    nome: "buffer",
    funcao: "junta a rajada num pensamento só",
    k: -1, dx: "25cqw", dy: "-24cqh",
  },
  {
    nome: "grafo",
    funcao: "decide a rota: conversar, agendar ou chamar um humano",
    k: 0, dx: "-29cqw", dy: "6cqh",
  },
  {
    nome: "guard",
    funcao: "confere a saída antes de enviar — não pede, verifica",
    k: 1, dx: "26cqw", dy: "13cqh",
    enfase: true,
  },
  {
    nome: "memória",
    funcao: "lembra entre turnos, fora do processo",
    k: 2, dx: "-2cqw", dy: "33cqh",
  },
];

const CIRCULADOS = ["①", "②", "③", "④", "⑤"];

export default async function PreviaExplodida({
  params,
}: {
  params: Promise<{ idioma: string }>;
}) {
  const { idioma } = await params;
  if (idioma !== "pt") notFound();

  return (
    <div className={`ex ex-sans ${plexSans.variable} ${plexMono.variable} flex-1`}>
      <BarraPrevia atual="explodida" />

      <div className="mx-auto max-w-5xl px-6">
        <header className="pb-4 pt-16 sm:pt-24">
          <p className="ex-rotulo">
            Folha 01 · {PERFIL_PREVIA.nome} · {PERFIL_PREVIA.lugar}
          </p>
          <h1 className="mt-5 max-w-[22ch] text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            {PERFIL_PREVIA.frase}
          </h1>
          <p className="ex-rotulo mt-6">{PERFIL_PREVIA.sublinha}</p>
        </header>
      </div>

      <section className="ex-cena" aria-label="Vista explodida do agente conversacional">
        <div className="ex-palco">
          <div className="ex-montagem">
            <p className="ex-rotulo ex-dica">role para desmontar ↓</p>
            <div className="ex-involucro" aria-hidden />
            {PECAS.map((peca, i) => (
              <div
                key={peca.nome}
                className="ex-peca"
                data-enfase={peca.enfase ? "" : undefined}
                style={
                  {
                    "--k": peca.k,
                    "--dx": peca.dx,
                    "--dy": peca.dy,
                  } as React.CSSProperties
                }
              >
                <span className="ex-mono text-sm">
                  <span className="ex-numero">{CIRCULADOS[i]}</span>
                  {peca.nome}
                </span>
                <span className="ex-funcao">{peca.funcao}</span>
              </div>
            ))}
            <p className="ex-resultado ex-mono text-sm">
              <span className="text-[var(--ex-marca)]">resultado</span> · 3 clientes em
              produção sobre a mesma arquitetura
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6">
        <section className="border-t border-[var(--ex-regua)] py-14">
          <p className="ex-rotulo">Catálogo de peças · sistemas já montados</p>
          <ol className="mt-6 grid gap-px border border-[var(--ex-regua)] bg-[var(--ex-regua)] sm:grid-cols-2">
            {CASOS_PREVIA.map((caso, i) => (
              <li key={caso.slug} className="bg-[var(--ex-fundo)]">
                <Revelar atraso={i * 60} className="h-full">
                  <article className="h-full p-6">
                    <p className="ex-rotulo">
                      <span className="text-[var(--ex-marca)]">{CIRCULADOS[i]}</span> peça{" "}
                      {String(i + 1).padStart(2, "0")} · {caso.dominio}
                    </p>
                    <h2 className="mt-3 text-lg font-semibold leading-snug">{caso.titulo}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--ex-suave)]">{caso.pedido}</p>
                    <p className="ex-mono mt-5 border-t border-dashed border-[var(--ex-regua)] pt-4 text-sm">
                      <span className="text-xl">{caso.destaque.valor}</span>{" "}
                      <span className="text-[var(--ex-suave)]">{caso.destaque.rotulo}</span>
                    </p>
                  </article>
                </Revelar>
              </li>
            ))}
          </ol>
        </section>

        <footer className="border-t border-[var(--ex-regua)] py-12">
          <p className="ex-rotulo">Fale com quem montou</p>
          <a
            href={`mailto:${PERFIL_PREVIA.email}`}
            className="ex-mono mt-3 inline-block text-xl hover:text-[var(--ex-marca)]"
          >
            {PERFIL_PREVIA.email}
          </a>
        </footer>
      </div>
    </div>
  );
}
