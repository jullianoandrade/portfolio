/**
 * Dados compartilhados pelas quatro prévias de mundo visual.
 *
 * As quatro homes mostram exatamente o mesmo conteúdo — só muda o mundo em
 * volta. Título e domínio vêm de `conteudo/pt.ts`; o resto foi derivado das
 * restrições e decisões que já estão escritas em cada caso.
 *
 * ATENÇÃO: `pedido` é PARÁFRASE escrita para a prévia, não citação real. Se o
 * mundo escolhido usar a voz de quem pediu, cada pedido precisa virar a frase
 * literal de alguém da operação.
 */
import { pt } from "@/conteudo/pt";

export interface CasoPrevia {
  slug: string;
  titulo: string;
  dominio: string;
  /** O gargalo como chegou. */
  pedido: string;
  /** O que estava escondido agora. */
  agora: string;
  /** O que quebraria depois se ninguém enxergasse. */
  laFrente: string[];
  destaque: { valor: string; rotulo: string };
}

const EXTRAS: Record<string, Omit<CasoPrevia, "slug" | "titulo" | "dominio">> = {
  "agente-conversacional": {
    pedido:
      "O cliente manda três mensagens seguidas e o atendimento responde três coisas diferentes.",
    agora: "a rajada de mensagens é um pensamento só",
    laFrente: [
      "o webhook vai ser reentregue se o modelo demorar",
      "o telefone do cliente vai parar num log",
    ],
    destaque: { valor: "3", rotulo: "clientes em produção" },
  },
  "economize-milhas": {
    pedido: "Todo comparador responde igual, como se a milha tivesse um preço só.",
    agora: "o valor depende do custo por milheiro de quem pergunta",
    laFrente: [
      "sem credencial nenhuma, o app ainda tem que subir",
      "acessibilidade não pode depender de alguém lembrar",
    ],
    destaque: { valor: "328", rotulo: "testes automatizados" },
  },
  "laudo-enquadramento": {
    pedido: "O primeiro rascunho do laudo consome horas de um especialista.",
    agora: "cada projeto precisa da própria análise, sem disputar contexto",
    laFrente: [
      "a chave da API não pode chegar ao navegador",
      "o modelo não pode preencher dado que falta",
    ],
    destaque: { valor: "6", rotulo: "seções fixas, pendências explícitas" },
  },
  "ingestao-em-escala": {
    pedido: "A importação arrasta e trava o dia do analista.",
    agora: "o problema é o formato dos dados, não o código",
    laFrente: [
      "a memória disponível é a de um notebook",
      "reconverter a cada execução repete a parte cara",
    ],
    destaque: { valor: "16 mi+", rotulo: "linhas cruzadas numa apuração" },
  },
  "contratos-bancarios": {
    pedido: "Cada contrato tem dezenas de páginas e alguém precisa achar a taxa e refazer a conta.",
    agora: "o modelo não deve calcular a taxa — só extrair",
    laFrente: [
      "o dado pessoal não pode chegar ao provedor",
      "o número precisa se sustentar numa contestação",
    ],
    destaque: { valor: "0", rotulo: "dado pessoal enviado ao modelo" },
  },
};

export const CASOS_PREVIA: CasoPrevia[] = pt.casos.map((caso) => {
  const extra = EXTRAS[caso.slug];
  // Caso novo sem dados de prévia quebra o build em vez de sair pela metade.
  if (!extra) throw new Error(`prévia sem dados para o caso "${caso.slug}"`);
  return { slug: caso.slug, titulo: caso.titulo, dominio: caso.dominio, ...extra };
});

export const PERFIL_PREVIA = {
  nome: pt.perfil.nome,
  email: pt.perfil.email,
  frase: "Escuto o gargalo, enxergo o sistema que ainda não existe e coloco ele para rodar.",
  sublinha: "AI engineer full stack · automação de processos orientada a resultado",
  lugar: pt.perfil.localizacao,
};

export const MUNDOS = [
  { slug: "contrato", nome: "O Contrato", ideia: "Cada caso é um contrato resolvido. O Sentido revela o que estava escondido." },
  { slug: "scanner", nome: "O Scanner", ideia: "A operação manual vista pelos seus olhos. A varredura anota, o Executar resolve." },
  { slug: "explodida", nome: "A Vista Explodida", ideia: "O sistema montado se desmonta em peças conforme você rola." },
  { slug: "mapa", nome: "O Mapa Mecânico", ideia: "Um território onde cada caso se ergue sobre engrenagens." },
] as const;
