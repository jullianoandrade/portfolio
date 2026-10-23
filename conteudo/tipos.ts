/**
 * Contrato do conteúdo do portfólio.
 *
 * Os dois idiomas satisfazem este mesmo tipo. Se `pt.ts` ganhar um campo que
 * `en.ts` não tem, o build quebra — a tradução não sai pela metade em produção.
 *
 * Alguns campos são obrigatórios de propósito, para que o tipo imponha a
 * disciplina editorial em vez de depender de lembrança:
 *
 *   `Papel`     — não existe caso sem dizer o que foi dele e o que foi do time.
 *   `Metrica`   — número sem período não é resultado, é slogan.
 *   `Decisao`   — exige a alternativa descartada e o custo; sem isso é só
 *                 lista de tecnologia.
 */

export const IDIOMAS = ["pt", "en"] as const;
export type Idioma = (typeof IDIOMAS)[number];

/**
 * O que foi dele e o que foi do time. Obrigatório em todo caso.
 *
 * `tipo` dá a forma do envolvimento; `descricao` diz o que exatamente foi
 * dele, e é obrigatório justamente para que não exista linha de papel
 * genérica repetida de caso em caso — "participei" não informa nada, enquanto
 * "estruturei o backend e a camada de ingestão" informa tudo.
 *
 * `pessoasNoTime` é opcional de propósito: número de time que não se sabe
 * não deve ser inventado para preencher um campo.
 */
export type Papel =
  | { tipo: "solo"; descricao: string }
  | { tipo: "time"; descricao: string; pessoasNoTime?: number };

/** Número com período obrigatório; `base` quando houver ponto de partida. */
export interface Metrica {
  valor: string;
  rotulo: string;
  periodo: string;
  base?: string;
}

/** Decisão técnica com o que foi descartado e o que custou. */
export interface Decisao {
  titulo: string;
  escolha: string;
  descartado: string;
  custo: string;
}

/** Rótulos de um nó do diagrama. A geometria vive em `conteudo/diagramas`. */
export interface RotuloNo {
  rotulo: string;
  descricao: string;
}

export interface Arquitetura {
  diagramaId: string;
  /** Uma entrada por nó da geometria — a checagem de cobertura é em runtime. */
  nos: Record<string, RotuloNo>;
  legenda?: string;
}

export interface Link {
  rotulo: string;
  url: string;
}

export interface Caso {
  slug: string;
  titulo: string;
  /** Uma frase: o que o sistema faz. Aparece no cartão da home. */
  resumo: string;
  dominio: string;
  periodo: string;
  papel: Papel;
  /** Verdadeiro só para o carro-chefe. */
  destaque: boolean;
  /**
   * Trabalho sob confidencialidade: renderiza a nota de que o caso descreve
   * arquitetura e decisões sem expor código, credenciais, clientes ou dados.
   */
  confidencial: boolean;
  metricas: Metrica[];
  problema: string;
  restricoes: string[];
  arquitetura?: Arquitetura;
  decisoes: Decisao[];
  resultado: string[];
  aprendizado: string;
  stack: string[];
  links?: Link[];
}

/** Eixo de organização da home: capacidade, não domínio. */
export interface Capacidade {
  id: string;
  titulo: string;
  descricao: string;
  /** slugs de casos que a demonstram */
  casos: string[];
}

export interface Trajetoria {
  periodo: string;
  cargo: string;
  organizacao: string;
  descricao: string;
}

export interface Perfil {
  nome: string;
  titulo: string;
  localizacao: string;
  disponibilidade: string;
  /** O arco da narrativa, um parágrafo por movimento. */
  arco: string[];
  trajetoria: Trajetoria[];
  email: string;
  linkedin: string;
  github: string;
}

/** Strings de interface — tudo que não é conteúdo de caso. */
export interface Interface {
  navegacao: {
    sobre: string;
    capacidades: string;
    casos: string;
    contato: string;
  };
  heroChamada: string;
  heroSubtitulo: string;
  verCaso: string;
  voltar: string;
  rotulos: {
    papel: string;
    problema: string;
    restricoes: string;
    arquitetura: string;
    decisoes: string;
    resultado: string;
    aprendizado: string;
    stack: string;
    dominio: string;
    periodo: string;
    escolha: string;
    descartado: string;
    custo: string;
  };
  notaConfidencialidade: string;
  /** Forma do envolvimento. A substância vem de `Papel.descricao`. */
  papel: {
    solo: string;
    time: string;
    timeCom: (pessoas: number) => string;
  };
  trocarIdioma: string;
}

export interface Conteudo {
  idioma: Idioma;
  perfil: Perfil;
  interface: Interface;
  capacidades: Capacidade[];
  casos: Caso[];
}

/** O caso em destaque, ou o primeiro se nenhum estiver marcado. */
export function casoDestaque(conteudo: Conteudo): Caso {
  return conteudo.casos.find((c) => c.destaque) ?? conteudo.casos[0];
}

export function casoPorSlug(conteudo: Conteudo, slug: string): Caso | undefined {
  return conteudo.casos.find((c) => c.slug === slug);
}

/** Só a forma do envolvimento: "Projeto meu", "Em time de 4". */
export function formaDoPapel(papel: Papel, i: Interface): string {
  if (papel.tipo === "solo") return i.papel.solo;
  return papel.pessoasNoTime === undefined
    ? i.papel.time
    : i.papel.timeCom(papel.pessoasNoTime);
}
