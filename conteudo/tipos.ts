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
  vitrine: Vitrine;
}

/** Para quem o sistema foi feito. A etiqueta da bancada e do prédio. */
export type Etiqueta = "interno" | "clientes" | "proprio";

/**
 * A versão curta do caso que a bancada da home mostra ao lado do sistema
 * funcionando. O caso inteiro continua na página dele.
 */
export interface Vitrine {
  etiqueta: Etiqueta;
  /** O que vem depois da etiqueta: "Equipe jurídica", "3 empresas, mesma arquitetura". */
  detalhe: string;
  /** Nome na régua da bancada. */
  curto: string;
  gargalo: string;
  resultado: string;
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
  /** O arco da narrativa, um parágrafo por movimento. */
  arco: string[];
  trajetoria: Trajetoria[];
  email: string;
  linkedin: string;
  github: string;
}

/**
 * Os seis familiares da abertura. A ordem é a de entrada em cena; o papel de
 * cada um está em `components/abertura/Familiar.tsx`.
 */
export const FAMILIARES = ["escriba", "triador", "guardiao", "arquiteto", "mensageiro", "vigia"] as const;
export type NomeFamiliar = (typeof FAMILIARES)[number];

/**
 * A abertura da home: o caos das dores que pedem um AI engineer, o tempo
 * parado em que ele marca os gargalos, o estalo, e os agentes montando o
 * hero na frente de quem visita.
 *
 * A prova que o Guardião põe no lugar da frase de efeito é a amplitude do
 * trabalho, contada dos próprios casos: a cena nunca afirma um número que o
 * portfólio não sustenta, e o hero fala dele, não de um projeto só.
 */
export interface Abertura {
  /**
   * O caos: as dores que levam alguém a procurar um AI engineer, metade na
   * língua do negócio, metade na dor de IA. Na ordem das posições da cena.
   */
  fragmentos: string[];
  /**
   * As três dores que ele marca com o tempo parado, na ordem dos cards da
   * primeira fileira: cada uma vira o card do caso que a resolve.
   */
  marcas: [string, string, string];
  rotuloGargalo: string;
  rotuloPendencias: string;
  /** O contador, quando o tempo para. */
  parado: string;
  familiares: Record<NomeFamiliar, string>;
  /** Escrita no hero e riscada pelo Guardião: o que este portfólio não diz. */
  fraseDeEfeito: string;
  carimbo: string;
  comentarioGuardiao: string;
  /**
   * O Vigia aponta o que quebra lá na frente, no caso de dados; o Triador
   * responde com a decisão que o caso de fato tomou.
   */
  comentarioVigia: string;
  respostaTriador: string;
  resolvido: string;
  pular: string;
  credito: string;
  verDeNovo: string;
}

/** Strings de interface — tudo que não é conteúdo de caso. */
export interface Interface {
  navegacao: {
    passei: string;
    casos: string;
    time: string;
    contato: string;
  };
  heroChamada: string;
  /**
   * A linha que o Guardião põe no lugar da frase de efeito: quantos sistemas,
   * em quais domínios, contada das pranchas. Fica fora de `abertura` porque é
   * função, e os textos da cena vão para o navegador.
   */
  heroAmplitude: (sistemas: number, dominios: string[]) => string;
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
  abertura: Abertura;
}

export interface Conteudo {
  idioma: Idioma;
  perfil: Perfil;
  interface: Interface;
  capacidades: Capacidade[];
  casos: Caso[];
  cenas: Cenas;
}

/* ============================================================
   As cenas da home, depois da abertura. Tudo aqui vai para componentes
   de cliente, então nada de função: só texto e dados.
   ============================================================ */

/** Um andar do prédio: um setor da empresa por onde ele passou. */
export interface Setor {
  id: string;
  nome: string;
  marco?: "inicio" | "hoje";
  /** O que ele construiu ali; `caso` leva à bancada quando existe caso. */
  sistemas: { nome: string; caso?: string }[];
  titulo: string;
  descricao: string;
  /** Só quando foi confirmada — andar sem etiqueta não ganha uma por suposição. */
  etiqueta?: Etiqueta;
  /** Só resultado real, informado por ele. */
  resultados: { valor: string; rotulo: string }[];
  /** O que o Mensageiro diz ao chegar no andar. */
  fala: string;
  /** Quem trabalha naquele andar, desenhado no canto. */
  agente?: NomeFamiliar;
}

/** Um projeto feito por conta própria, fora do Grupo Studio. */
export interface ProjetoProprio {
  sistema: string;
  caso: string;
  nota: string;
}

/**
 * O que acontece quando a execução de uma prancha chega num nó: a linha do
 * rastro, se aquele passo deu errado, e o familiar que assume para comentar.
 * A chave é o id do nó; numa segunda passagem pelo mesmo nó, `id#2`.
 */
export interface EventoNo {
  t?: string;
  mal?: boolean;
  fala?: [NomeFamiliar, string];
}

export interface CenarioPrancha {
  rotulo: string;
  /** A mensagem de quem está do outro lado, quando o sistema conversa. */
  cliente?: string;
  resposta?: string;
  caminho: string[];
  eventos: Record<string, EventoNo>;
}

/**
 * Um sistema na cena de projetos. A geometria do desenho fica em
 * `components/cenas/plantas.ts`; aqui, só o que se traduz.
 */
export interface Prancha {
  id: string;
  /** O nome do projeto, em cima da prancha. */
  nome: string;
  /** O caso com página própria, quando existe. */
  caso?: string;
  /** O domínio de quem não tem caso; os demais usam o do caso. */
  dominio?: string;
  setor: string;
  /** O familiar dono da decisão central do sistema. */
  dono: NomeFamiliar;
  titulo: string;
  numero: string;
  fala: string;
  /** O que o dono diz quando o pacote passa pelo nó da regra dele. */
  reacao: string;
  corpo: string;
  stack: string[];
  porTras: string[];
  nos: Record<string, { rotulo: string; sub?: string }>;
  cenarios: CenarioPrancha[];
}

/**
 * Uma conversa fictícia que o visitante manda ao agente. `caminho` são os
 * nós do grafo real, na ordem em que a mensagem passa por eles.
 */
export interface Simulacao {
  pergunta: string;
  caminho: string[];
  resposta: string;
  /** Dado que um nó trouxe de fora (agenda, briefing), mostrado junto dele. */
  dados?: { no: string; texto: string }[];
  /** Rascunho que o guard barra; quando existe, o guard acende em vermelho. */
  barrado?: string;
  anfitriao: NomeFamiliar;
  fala: [string, string];
}

/** A ficha de cada agente na cena do time. */
export interface FichaAgente {
  regra: string;
  porQue: string;
  onde: { texto: string; caso: string };
}

export interface Cenas {
  trilho: { inicio: string; passei: string; casos: string; time: string; contato: string };
  passei: {
    rotulo: string;
    /** A empresa e o período: o prédio é ela. */
    empresa: string;
    titulo: [string, string];
    texto: string;
    marcos: { inicio: string; hoje: string };
    etiquetas: Record<Etiqueta, string>;
    convite: string;
    /** De baixo para cima: a ordem em que ele passou. */
    setores: Setor[];
    /** Logo abaixo do prédio, o que ele construiu por conta própria. */
    porConta: string;
    proprios: ProjetoProprio[];
  };
  pranchas: {
    rotulo: string;
    titulo: string;
    verDetalhes: string;
    fechar: string;
    anterior: string;
    proximo: string;
    rodando: string;
    /** O que o Arquiteto diz enquanto monta a primeira prancha. */
    montando: string;
    /** O que o Arquiteto diz ao terminar a planta, antes de passar a vez. */
    montado: string;
    arquitetura: string;
    escolha: string;
    vazio: string;
    legenda: string;
    simulada: string;
    casoCompleto: string;
    porTras: string;
    cliente: string;
    agente: string;
    /** O trecho do contrato que o código calcula; `{taxa}` vira o número. */
    taxa: string;
    milhas: {
      controle: string;
      passagem: string;
      /** `{m}` vira o custo do milheiro e `{total}` o custo em milhas. */
      calculo: string;
      emMilhas: string;
      emDinheiro: string;
      falaMilhas: string;
      falaDinheiro: string;
      nota: string;
    };
    itens: Prancha[];
  };
  construi: {
    rotulo: string;
    anterior: string;
    proximo: string;
    gargalo: string;
    resultado: string;
    porTras: string;
    casoCompleto: string;
    agente: {
      instrucao: string;
      ficticia: string;
      simulacoes: Simulacao[];
    };
    contratos: {
      instrucao: string;
      ficticio: string;
      passos: [string, string, string, string];
      campos: { prazo: string; financiado: string; parcela: string };
      taxaEfetiva: string;
      mediaPublicada: string;
      acima: string;
      dentro: string;
      fala: [string, string];
    };
    ingestao: {
      linhaALinha: string;
      emColunas: string;
      memoria: string;
      tabela: string;
      estadoLinha: string;
      estadoColuna: string;
      persistido: string;
      escala: string;
      fala: [string, string];
    };
    laudo: {
      gerar: string;
      faltou: string;
      checklist: string;
      etapa: string;
      projeto: string;
      conclusao: string;
      chamada: string;
      secao: string;
      pendencia: string;
      rodape: string;
      fala: [string, string];
    };
    milhas: {
      preco: string;
      milhas: string;
      taxas: string;
      milheiro: string;
      emMilhas: string;
      emDinheiro: string;
      vereditoMilhas: string;
      vereditoDinheiro: string;
      nota: string;
      verNoAr: string;
      fala: [string, string];
    };
  };
  time: {
    rotulo: string;
    titulo: [string, string];
    texto: string;
    rotulos: { porQue: string; onde: string };
    fichas: Record<NomeFamiliar, FichaAgente>;
    /** O que se diz enquanto o time se monta, na primeira chegada. */
    montagem: { mensageiro: string; guardiao: string; carimbo: string };
  };
  contato: {
    rotulo: string;
    titulo: string;
    texto: string;
    fala: string;
    montagem: { escriba: string };
  };
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
