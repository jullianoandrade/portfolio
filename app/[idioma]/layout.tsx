import type { Metadata } from "next";
import { Geist, Geist_Mono, Marcellus_SC } from "next/font/google";
import { notFound } from "next/navigation";

import { IDIOMAS, ehIdioma, obterConteudo } from "@/conteudo";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
// Versalete gravado, só no nome: a assinatura do hero.
const gravura = Marcellus_SC({ variable: "--fonte-gravura", weight: "400", subsets: ["latin"] });

/**
 * Este é o layout raiz da aplicação: não existe `app/layout.tsx`.
 * É o padrão de i18n do Next — só assim o atributo `lang` do <html> reflete
 * o idioma da rota, em vez de ficar fixo em um deles.
 */

export async function generateStaticParams() {
  return IDIOMAS.map((idioma) => ({ idioma }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ idioma: string }>;
}): Promise<Metadata> {
  const { idioma } = await params;
  if (!ehIdioma(idioma)) return {};

  const { perfil, interface: ui } = obterConteudo(idioma);
  return {
    title: `${perfil.nome} — ${perfil.titulo}`,
    description: ui.heroSubtitulo,
    openGraph: {
      title: `${perfil.nome} — ${perfil.titulo}`,
      description: ui.heroSubtitulo,
      locale: idioma === "pt" ? "pt_BR" : "en_US",
      type: "website",
    },
  };
}

/**
 * Marca o documento como "JavaScript disponível" antes da primeira pintura.
 * O CSS só esconde o que será revelado quando esta classe existe — sem isso,
 * quem desabilita JS veria uma página em branco.
 */
const MARCA_JS = `document.documentElement.classList.add("js-pronto")`;

export default async function LayoutRaiz({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ idioma: string }>;
}) {
  const { idioma } = await params;
  if (!ehIdioma(idioma)) notFound();

  return (
    <html
      lang={idioma === "pt" ? "pt-BR" : "en"}
      className={`${geistSans.variable} ${geistMono.variable} ${gravura.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MARCA_JS }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
