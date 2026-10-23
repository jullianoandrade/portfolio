import { en } from "./en";
import { pt } from "./pt";
import { IDIOMAS, type Conteudo, type Idioma } from "./tipos";

/**
 * O registro é tipado como `Record<Idioma, Conteudo>`: esquecer um idioma
 * novo aqui, ou divergir o formato entre `pt.ts` e `en.ts`, quebra o build.
 */
const CONTEUDOS: Record<Idioma, Conteudo> = { pt, en };

export function ehIdioma(valor: string): valor is Idioma {
  return (IDIOMAS as readonly string[]).includes(valor);
}

export function obterConteudo(idioma: Idioma): Conteudo {
  return CONTEUDOS[idioma];
}

export function outroIdioma(idioma: Idioma): Idioma {
  return idioma === "pt" ? "en" : "pt";
}

export { IDIOMAS };
export type { Conteudo, Idioma };
