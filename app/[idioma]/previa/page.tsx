import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MUNDOS } from "@/components/previa/dados";

export const metadata: Metadata = {
  title: "Prévias de mundo visual",
  robots: { index: false, follow: false },
};

export default async function IndicePrevias({
  params,
}: {
  params: Promise<{ idioma: string }>;
}) {
  const { idioma } = await params;
  if (idioma !== "pt") notFound();

  return (
    <main className="min-h-screen flex-1 bg-[#0c0c0c] px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/50">
          Prévias · não indexadas · não ligadas a partir do site
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Quatro mundos, o mesmo conteúdo</h1>
        <p className="mt-4 max-w-[60ch] leading-relaxed text-white/70">
          As quatro homes mostram os mesmos cinco casos, a mesma frase e o mesmo contato. Só o mundo em
          volta muda — para você comparar a identidade, não o texto. Vale abrir no celular também.
        </p>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2">
          {MUNDOS.map((mundo, i) => (
            <li key={mundo.slug}>
              <Link
                href={`/pt/previa/${mundo.slug}`}
                className="block h-full border border-white/15 p-6 transition-colors hover:border-white/50"
              >
                <p className="font-mono text-xs text-white/40">0{i + 1}</p>
                <h2 className="mt-2 text-xl font-semibold">{mundo.nome}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{mundo.ideia}</p>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
