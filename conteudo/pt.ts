import type { Conteudo } from "./tipos";

/**
 * Conteúdo em português.
 *
 * ATENÇÃO às métricas: todo número aqui precisa de origem verificável e de um
 * período. Onde só existe número de implementação (nós do grafo, cenários de
 * eval), o rótulo diz exatamente isso — nunca disfarçado de resultado de
 * negócio. Os marcadores `PENDENTE` indicam onde falta número de produção que
 * só o Juliano tem.
 */
export const pt: Conteudo = {
  idioma: "pt",

  perfil: {
    nome: "Juliano Andrade",
    titulo: "AI Engineer",
    localizacao: "Gravataí, RS · Brasil",
    arco: [
      "Entrei no Grupo Studio como o primeiro profissional de automação da empresa. Não havia área, não havia processo e não havia ferramenta — havia planilha, portal de governo e muita gente repetindo a mesma tarefa.",
      "Montei a prática do zero: escolhi as ferramentas, defini como um robô entra em produção e como ele avisa quando quebra, e treinei o time que veio depois. É por isso que meu repertório é largo — eu era o único, então passei por tudo.",
      "Hoje meu trabalho é desenhar sistemas de IA que aguentam produção: agentes que conversam com clientes reais, recuperação sobre base própria, avaliação automatizada rodando em CI. O domínio mudou várias vezes — varejo, jurídico, trabalhista, consumo. O que não muda é o tipo de problema: transformar trabalho manual em sistema que dá para confiar.",
    ],
    trajetoria: [
      {
        periodo: "nov/2025 — hoje",
        cargo: "Engenheiro de IA e Automação",
        organizacao: "Grupo Studio",
        descricao:
          "Primeiro profissional de automação da empresa. Estruturei a área, e hoje construo agentes e sistemas de IA além de mentorar o time.",
      },
      {
        periodo: "2023 — hoje",
        cargo: "Ciência da Computação",
        organizacao: "Unisinos",
        descricao: "Graduação em andamento.",
      },
    ],
    email: "juliano.andrade.cs@gmail.com",
    linkedin: "https://www.linkedin.com/in/jullianoandrade/",
    github: "https://github.com/jullianoandrade",
  },

  interface: {
    navegacao: {
      passei: "Por onde passei",
      casos: "O que eu construí",
      time: "O time",
      contato: "Fale comigo",
    },
    heroChamada: "Escuto o gargalo, enxergo o sistema que ainda não existe e coloco ele para rodar.",
    heroAmplitude: (sistemas, dominios) =>
      `${sistemas} sistemas em ${dominios.length} domínios: ${new Intl.ListFormat("pt-BR").format(dominios)}.`,
    heroSubtitulo:
      "Agentes, recuperação sobre base própria e avaliação automatizada — em varejo, jurídico, trabalhista e consumo. Cheguei numa empresa onde não havia área de automação e montei a prática do zero.",
    verCaso: "Ver o caso",
    voltar: "Todos os casos",
    rotulos: {
      papel: "Meu papel",
      problema: "O problema",
      restricoes: "As restrições reais",
      arquitetura: "Arquitetura",
      decisoes: "Decisões e o que custaram",
      resultado: "Resultado",
      aprendizado: "O que levei disso",
      stack: "Stack",
      dominio: "Domínio",
      periodo: "Período",
      escolha: "Escolhi",
      descartado: "Descartei",
      custo: "Custou",
    },
    notaConfidencialidade:
      "Este caso descreve arquitetura e decisões sem expor código proprietário, credenciais, clientes ou dados de operação.",
    papel: {
      solo: "Projeto meu",
      time: "Em time",
      timeCom: (pessoas) => `Em time de ${pessoas}`,
    },
    trocarIdioma: "English",
    abertura: {
      fragmentos: [
        "ticket #412 · cliente sem resposta desde 22h",
        "a equipe lê contrato por contrato",
        "análise do cliente: 4 dias",
        "16 milhões de linhas · o notebook travou",
        "Re: Re: precisamos de IA, por onde começar?",
        "quem confere o que a IA responde?",
        "a IA esqueceu a conversa de ontem",
        "POC aprovada… e agora, produção?",
        "o laudo tomou a tarde do especialista",
      ],
      marcas: ["Re: o bot inventou preço de novo", "jurídico: posso mandar o contrato pro ChatGPT?", "funciona na demo, quebra em escala"],
      rotuloGargalo: "Gargalo",
      rotuloPendencias: ["Perguntas", "sem", "resposta"],
      respondidas: "com",
      naoLidas: "não lidas",
      parado: "parado",
      familiares: {
        escriba: "Escriba",
        triador: "Triador",
        guardiao: "Guardião",
        arquiteto: "Arquiteto",
        mensageiro: "Mensageiro",
        vigia: "Vigia",
      },
      fraseDeEfeito: "Resolvo qualquer gargalo, em qualquer empresa.",
      carimbo: "Não passa",
      comentarioGuardiao: "“Qualquer” não se prova. Troquei pelo número.",
      comentarioVigia: "Isso aqui quebra em escala.",
      respostaTriador: "Li em colunas, fora da memória.",
      resolvido: "resolvido",
      pular: "Pular",
      credito: "Montado na sua frente por Juliano + 6 agentes",
      verDeNovo: "ver de novo",
    },
  },

  capacidades: [
    {
      id: "agentes",
      titulo: "Agentes e orquestração",
      descricao:
        "Conversa longa não cabe num prompt. Desenho o fluxo como grafo de estado tipado, com rota explícita, memória persistida fora do processo e caminho de saída para um humano.",
      casos: ["agente-conversacional"],
    },
    {
      id: "recuperacao",
      titulo: "Recuperação e contexto",
      descricao:
        "RAG quando a pergunta é conceitual, catálogo determinístico quando a resposta precisa ser exata. Saber qual dos dois usar é metade do trabalho.",
      casos: ["agente-conversacional"],
    },
    {
      id: "confiabilidade",
      titulo: "Confiabilidade e privacidade",
      descricao:
        "Modelo que não é medido regride em silêncio, e dado pessoal que entra num prompt não volta. Avaliação automatizada com saída binária para CI, barreira verificando a saída, e mascaramento antes da inferência em vez de confiança na política do fornecedor.",
      casos: ["agente-conversacional", "laudo-enquadramento", "contratos-bancarios"],
    },
    {
      id: "produto",
      titulo: "Do protótipo ao produto",
      descricao:
        "A distância entre demo e produção é feita de rate limit, retry, custo por chamada e o que acontece quando a API de terceiro cai. É onde passo a maior parte do tempo.",
      casos: ["agente-conversacional", "economize-milhas", "laudo-enquadramento"],
    },
    {
      id: "dados",
      titulo: "Dados em escala",
      descricao:
        "Quando o volume cresce, o ganho raramente vem de otimizar o código que existe — vem de mudar o formato em que o dado é lido e de cortar trabalho que não precisava acontecer.",
      casos: ["ingestao-em-escala"],
    },
  ],

  casos: [
    {
      slug: "agente-conversacional",
      vitrine: {
        etiqueta: "clientes",
        detalhe: "3 empresas, mesma arquitetura",
        curto: "Atendimento",
        gargalo:
          "A pessoa escreve em rajada, o canal reentrega a mensagem e a conversa precisa lembrar de ontem.",
        resultado:
          "Conduz a conversa inteira e entrega ao especialista com briefing pronto. 14 cenários de avaliação rodam em CI.",
      },
      titulo: "Um agente que atende no WhatsApp e sabe a hora de chamar um humano",
      resumo:
        "Atendimento consultivo por WhatsApp: entende a necessidade, recomenda a partir de catálogo próprio, responde dúvida conceitual por RAG e passa para um especialista com briefing pronto.",
      dominio: "Varejo",
      periodo: "2026",
      papel: {
        tipo: "solo",
        descricao: "Do desenho do grafo ao deploy, incluindo os guardrails e a suíte de avaliação.",
      },
      destaque: true,
      confidencial: true,
      metricas: [
        // PENDENTE: números de produção (conversas atendidas, taxa de handoff,
        // tempo de resposta médio) — só o Juliano tem acesso.
        {
          valor: "3",
          rotulo: "clientes em produção sobre a mesma arquitetura",
          periodo: "2026",
          base: "ajuste por operação, não reescrita",
        },
        { valor: "14", rotulo: "cenários de eval rodando em CI", periodo: "desde jun/2026" },
        { valor: "9", rotulo: "nós no grafo de conversa", periodo: "arquitetura atual" },
      ],
      problema:
        "Atendimento consultivo no WhatsApp quebra o laço ingênuo de mensagem → modelo → resposta. A pessoa escreve em rajada, o canal reentrega o evento se você demorar, e a conversa precisa lembrar de ontem. Qualquer um dos três, sozinho, já produz um atendimento que parece quebrado.",
      restricoes: [
        "A pessoa manda três mensagens em oito segundos. São um pensamento só — responder cada uma gera três respostas desencontradas.",
        "O webhook não pode esperar o modelo. Se a resposta demora, a API do WhatsApp reentrega o evento e a conversa duplica.",
        "A conversa é longa e precisa lembrar. O estado não cabe no prompt e não pode viver em memória de processo, que morre no primeiro redeploy.",
        "O agente não pode inventar preço nem prometer prazo. Em venda consultiva, errar isso custa mais caro que não responder.",
      ],
      arquitetura: {
        diagramaId: "agente",
        legenda:
          "Linha tracejada é rota condicional. O guard roda depois da composição, não dentro do prompt.",
        nos: {
          carregar: {
            rotulo: "carregar",
            descricao:
              "Hidrata o estado a partir do checkpointer em Postgres e da memória acumulada.",
          },
          entender: {
            rotulo: "entender",
            descricao:
              "Extrai intenção, entidades e o que ainda falta saber sobre quem está do outro lado.",
          },
          decidir: {
            rotulo: "decidir",
            descricao: "Roteia: seguir conversando, agendar, ou entregar a um humano.",
          },
          recuperar: {
            rotulo: "recuperar",
            descricao:
              "Resolve o catálogo canônico e, em dúvida conceitual, consulta o índice vetorial.",
          },
          agendar: {
            rotulo: "agendar",
            descricao: "Conversa com a agenda real e devolve horários que existem.",
          },
          compor: {
            rotulo: "compor",
            descricao: "Redige a resposta usando só o contexto que foi recuperado.",
          },
          guard: {
            rotulo: "guard",
            descricao:
              "Barreira de saída: não inventa preço, não promete prazo, não extrapola o catálogo. Roda sobre o texto pronto.",
          },
          persistir: {
            rotulo: "persistir",
            descricao: "Grava memória e entendimento acumulado para o próximo turno.",
          },
          handoff: {
            rotulo: "handoff",
            descricao: "Monta o briefing estruturado e entrega ao especialista humano.",
          },
        },
      },
      decisoes: [
        {
          titulo: "A barreira roda depois de compor, não dentro do prompt",
          escolha:
            "Verificar o texto já pronto contra regras explícitas, como última etapa antes de persistir.",
          descartado:
            "Confiar na instrução do prompt para o modelo não inventar preço nem prazo.",
          custo:
            "Uma passada a mais por resposta e um conjunto de regras para manter. Em troca, a classe de erro deixa de ser probabilística: pedir no prompt reduz a chance, verificar a saída elimina o caso.",
        },
        {
          titulo: "Estado tipado em vez de dicionário solto",
          escolha:
            "Contrato explícito entre os nós do grafo, verificável antes de rodar.",
          descartado: "Passar um dicionário livre de nó para nó, que é o caminho mais rápido.",
          custo:
            "Mais cerimônia para adicionar um campo. Em troca, renomear algo quebra no import e não às duas da manhã em produção.",
        },
        {
          titulo: "Dois motores, selecionados por variável de ambiente",
          escolha:
            "Manter o orquestrador imperativo antigo vivo ao lado do grafo novo, alternável sem redeploy.",
          descartado: "Migrar de uma vez e apagar o caminho antigo.",
          custo:
            "Código duplicado e duas implementações para manter durante a transição. Em troca, o rollback é uma variável de ambiente, não uma madrugada.",
        },
        {
          titulo: "Telefone pseudonimizado antes de sair do processo",
          escolha:
            "Hash com salt aplicado antes de qualquer log ou trace de observabilidade.",
          descartado:
            "Logar o número cru, que é mais simples de depurar quando algo dá errado.",
          custo:
            "Depurar um caso específico exige recalcular o hash. Em troca, nenhum trace devolve o número de ninguém.",
        },
      ],
      resultado: [
        "O agente conduz a conversa inteira, recomenda a partir do catálogo e entrega ao especialista com briefing estruturado, em vez de transferir uma transcrição crua.",
        "A avaliação automatizada roda com um modelo como juiz e devolve código de saída binário, então entra em CI como qualquer teste. Os cenários cobrem o que mais dói: inventar preço, prometer prazo, responder fora do catálogo e perder o fio entre turnos.",
        "Rollback de motor sem redeploy durante toda a migração para o grafo.",
      ],
      aprendizado:
        "Guardrail dentro do prompt é pedido; guardrail fora do prompt é garantia. Passei a tratar a saída do modelo como entrada não confiável — a mesma postura que qualquer um tem com entrada de usuário, e que por algum motivo se perde quando o texto vem de um LLM.",
      stack: ["LangGraph", "Python", "FastAPI", "PostgreSQL", "RAG", "LLM", "Langfuse", "Docker"],
    },

    {
      slug: "economize-milhas",
      vitrine: {
        etiqueta: "proprio",
        detalhe: "Código aberto",
        curto: "Milhas",
        gargalo:
          "Todo comparador responde igual para todo mundo, como se a milha tivesse um preço universal.",
        resultado: "No ar, com o código aberto e 328 testes cobrindo do cálculo à interface.",
      },
      titulo: "Esta passagem vale mais em milhas ou em dinheiro?",
      resumo:
        "A resposta muda conforme quem pergunta: quem tem cartão sem anuidade acumula milha a custo quase zero, quem compra ponto paga caro. O app calcula para o custo por milheiro de cada pessoa.",
      dominio: "Consumo",
      periodo: "2026",
      papel: {
        tipo: "solo",
        descricao: "Produto autoral: ideia, modelo de cálculo, interface, testes e deploy.",
      },
      destaque: false,
      confidencial: false,
      metricas: [
        { valor: "328", rotulo: "testes automatizados", periodo: "out/2026" },
        { valor: "100%", rotulo: "do código aberto e auditável", periodo: "desde o primeiro commit" },
      ],
      problema:
        "Todo comparador de milhas responde a mesma coisa para todo mundo, como se a milha tivesse um preço universal. Ela não tem: o mesmo voo, pelo mesmo preço, muda de recomendação conforme o custo por milheiro de quem pergunta.",
      restricoes: [
        "Sem credencial, o app tem que funcionar. Nenhuma chave pode ser bloqueante, senão quem clona o repositório vê uma tela de erro.",
        "Nada de chave de servidor no bundle. O prefixo que expõe variável ao navegador é uma armadilha de uma letra.",
        "Monetização por afiliado precisa ser visível. Link com marker sem selo de divulgação é propaganda disfarçada.",
      ],
      decisoes: [
        {
          titulo: "O app funciona inteiro com tudo em branco",
          escolha:
            "Base curada versionada junto do código, usada quando não há credencial configurada.",
          descartado: "Exigir configuração de Supabase e token de API para subir.",
          custo:
            "Manter uma base de fallback atualizada. Em troca, qualquer pessoa clona e roda em um comando — inclusive quem está avaliando o código.",
        },
        {
          titulo: "A paleta é medida, não declarada",
          escolha:
            "Teste automatizado lê o CSS e verifica contraste WCAG AA nos pares de cor reais.",
          descartado: "Confiar na inspeção visual e na boa intenção.",
          custo:
            "Um teste a mais para manter. Em troca, acessibilidade deixa de depender de alguém lembrar.",
        },
      ],
      resultado: [
        "No ar, aberto e clicável — é o único projeto desta página onde dá para ler o código inteiro.",
        "328 testes cobrindo desde o cálculo de custo por milheiro até a superfície pública do motor: cada campo exposto aparece numa tela ou está numa lista de lacunas com o motivo escrito.",
        "Instalável como PWA, com a mesma base para desktop e celular — quem decide o layout é o CSS, não JavaScript medindo tela.",
      ],
      aprendizado:
        "Escrever o teste que verifica o contraste de cor me convenceu de uma coisa: critério que não é executável não é critério, é intenção. Levei isso para todo projeto depois.",
      stack: ["Next.js", "TypeScript", "React", "Tailwind", "Supabase", "Vitest", "Vercel"],
      links: [
        { rotulo: "Ver no ar", url: "https://economizemilhas.vercel.app" },
        { rotulo: "Código", url: "https://github.com/jullianoandrade/economize_milhas" },
      ],
    },

    {
      slug: "laudo-enquadramento",
      vitrine: {
        etiqueta: "interno",
        detalhe: "Equipe de Lei do Bem",
        curto: "Laudo",
        gargalo:
          "O primeiro rascunho do laudo consumia horas de especialista, para ser revisado de qualquer forma.",
        resultado:
          "O rascunho sai durante a própria reunião. O especialista entra para revisar, não para redigir.",
      },
      titulo: "Laudo técnico preliminar redigido por modelo de linguagem",
      resumo:
        "Um apresentador percorre um checklist guiado com a empresa avaliada e o sistema redige um laudo preliminar de enquadramento de projetos de PD&I, entregue em PDF.",
      dominio: "Incentivo à inovação",
      periodo: "2026",
      papel: {
        tipo: "solo",
        descricao: "Da porta de acesso à geração do PDF, incluindo os prompts que redigem o laudo.",
      },
      destaque: false,
      confidencial: true,
      metricas: [
        { valor: "5", rotulo: "etapas no checklist guiado", periodo: "versão atual" },
        { valor: "6", rotulo: "seções fixas no laudo gerado", periodo: "versão atual" },
      ],
      problema:
        "O enquadramento de um projeto de PD&I em lei de incentivo é trabalho de especialista, e a primeira versão do laudo consumia horas de alguém caro para produzir um rascunho que seria revisado de qualquer forma.",
      restricoes: [
        "O laudo é preliminar e precisa dizer isso. Vai para revisão de responsável técnico habilitado antes de qualquer submissão — está impresso no rodapé de toda página do PDF.",
        "A chave da API não pode chegar ao navegador em nenhum caminho do código.",
        "O modelo não pode inventar dado ausente: o que faltar tem que sair explicitamente como pendência.",
      ],
      decisoes: [
        {
          titulo: "Uma chamada por projeto, mais uma para a conclusão",
          escolha:
            "Cada projeto recebe análise completa e isolada; a conclusão geral recebe só uma síntese de cada.",
          descartado:
            "Espremer todos os projetos num prompt só, que é mais barato em número de chamadas.",
          custo:
            "Mais chamadas e mais latência total. Em troca, os projetos não disputam espaço de contexto, e o prompt da conclusão não cresce sem limite conforme o cliente tem mais projetos.",
        },
        {
          titulo: "Erro trafega por código, não por mensagem",
          escolha:
            "Um tipo enumerado de erro; a interface ramifica no código e escolhe o texto.",
          descartado: "Repassar ao cliente a mensagem de erro que o provedor devolveu.",
          custo:
            "Mapear cada caso de falha. Em troca, detalhe de erro do provedor vai para o log do servidor e nunca para a tela de quem está com o cliente na frente.",
        },
      ],
      resultado: [
        "O rascunho que levava horas de especialista sai durante a própria reunião, e o especialista entra para revisar em vez de redigir.",
        "Nenhum caminho do código envia a chave da API ao navegador: a rota converte o stream do provedor em texto e trocar de provedor mexe num arquivo só.",
      ],
      aprendizado:
        "Gerar documento com LLM é fácil; gerar documento que alguém assina embaixo é outro problema. A parte difícil não foi o prompt — foi decidir o que o sistema faz quando falta informação, e garantir que ele aponte a lacuna em vez de preenchê-la.",
      stack: ["Next.js", "TypeScript", "React", "OpenAI", "pdfmake", "Vercel"],
    },

    {
      slug: "ingestao-em-escala",
      vitrine: {
        etiqueta: "interno",
        detalhe: "Operacional",
        curto: "16 mi de linhas",
        gargalo:
          "Milhões de eventos trabalhistas para cruzar num notebook de trabalho. Linha a linha, em memória, a importação arrastava.",
        resultado:
          "Mais de 16 milhões de linhas cruzadas em hardware de escritório, sem infraestrutura dedicada.",
      },
      titulo: "Dezesseis milhões de linhas rodando no notebook do analista",
      resumo:
        "Plataforma que lê arquivos de eventos trabalhistas compactados, converte para formato colunar e cruza os eventos entre si para apurar créditos previdenciários.",
      dominio: "Dados trabalhistas",
      periodo: "2026",
      papel: {
        tipo: "time",
        descricao:
          "Estruturei o backend. A arquitetura de ingestão que fez os arquivos grandes entrarem rápido foi decidida, testada e implementada por mim.",
      },
      destaque: false,
      confidencial: true,
      metricas: [
        {
          valor: "16 mi+",
          rotulo: "linhas cruzadas numa apuração",
          periodo: "escala de produção",
          base: "o que tornou essa escala viável em tempo de trabalho",
        },
      ],
      problema:
        "Apurar crédito previdenciário exige cruzar milhões de eventos trabalhistas entre si — quem é a pessoa, o que foi pago, o que foi retido — e conferir cada resultado contra o evento de fechamento do período. Feito do jeito óbvio, carregando tudo em memória linha a linha, a importação arrasta a ponto de inviabilizar o ritmo de trabalho do analista.",
      restricoes: [
        "Os arquivos chegam compactados, com milhares de XMLs dentro de um único pacote.",
        "O software roda na máquina do analista, não num cluster. A memória disponível é a de um notebook de trabalho.",
        "O cruzamento não é um join simples: um evento precisa ser auditado contra o evento de fechamento, que chega separado.",
        "Uma apuração demorada sem sinal de progresso é indistinguível de uma travada — e o analista mata o processo.",
      ],
      decisoes: [
        {
          titulo: "Colunar e fora da memória, em vez de linha a linha",
          escolha:
            "Converter os eventos para Parquet e cruzar com DuckDB, que lê o formato colunar direto do disco e processa mais dados do que caberia na RAM.",
          descartado:
            "Carregar os eventos parseados num dataframe em memória, que é o caminho natural em Python e funciona bem até a escala real chegar.",
          custo:
            "Uma etapa de conversão a mais no pipeline e um formato intermediário para gerenciar. Em troca, o cruzamento passa a rodar em tempo de trabalho, na máquina que a operação já tem.",
        },
        {
          titulo: "A conversão é etapa própria e fica persistida",
          escolha:
            "Separar a extração e a conversão da apuração, gravando o resultado intermediário em disco.",
          descartado:
            "Converter sob demanda a cada execução, o que mantém o pipeline mais simples.",
          custo:
            "Espaço em disco e o cuidado de invalidar o intermediário quando a entrada muda. Em troca, reexecutar a apuração — que é o que mais se faz durante uma análise — deixa de repetir a parte cara.",
        },
      ],
      resultado: [
        "A importação deixou de ser o gargalo: o cruzamento de mais de 16 milhões de linhas roda em hardware de escritório, sem infraestrutura dedicada.",
        "Reexecutar uma apuração com parâmetros diferentes não recomeça do zero, porque a conversão já está persistida.",
      ],
      aprendizado:
        "O ganho não veio de otimizar o código que existia — veio de trocar o formato dos dados antes de processá-los. Passei a tratar “em que formato isso vai ser lido” como decisão de arquitetura, não como detalhe de implementação.",
      stack: ["Python", "FastAPI", "DuckDB", "Polars", "PyArrow", "Parquet", "React"],
    },


    {
      slug: "contratos-bancarios",
      vitrine: {
        etiqueta: "interno",
        detalhe: "Equipe jurídica",
        curto: "Contratos",
        gargalo:
          "Dezenas de páginas para achar a cláusula e refazer a conta, num documento cheio de dado pessoal.",
        resultado:
          "O especialista revisa em vez de procurar. Cada número vem com a cláusula de onde saiu.",
      },
      titulo: "Achar juros abusivos em contrato bancário sem mostrar o cliente ao modelo",
      resumo:
        "Arquitetura que extrai e analisa cláusulas de contratos bancários para identificar possíveis juros abusivos, com os dados pessoais mascarados antes de qualquer inferência.",
      dominio: "Finanças",
      periodo: "2026",
      papel: {
        tipo: "solo",
        descricao:
          "Responsável pela construção da arquitetura: extração, análise e a camada de mascaramento que impede dado sensível de chegar ao modelo.",
      },
      destaque: false,
      confidencial: true,
      // PENDENTE: métricas de produção (contratos analisados, tempo por
      // contrato, taxa de revisão) — só o Juliano tem os números.
      metricas: [],
      problema:
        "Avaliar se um contrato bancário cobra juros acima do devido é leitura cara: alguém precisa achar as cláusulas certas no meio de dezenas de páginas e refazer a conta. É trabalho que um modelo de linguagem faz bem — exceto por um detalhe: o documento está cheio de dado pessoal de quem assinou.",
      restricoes: [
        "O contrato carrega nome, CPF, endereço, número de conta e valores. Mandar a página inteira para um provedor externo é tratar dado pessoal de terceiro sem necessidade.",
        "A LGPD não pede boa intenção, pede minimização: o modelo só deve receber o que é indispensável para a análise.",
        "A conclusão é usada numa decisão com consequência financeira para o cliente. Resposta que não dá para conferir não serve.",
      ],
      decisoes: [
        {
          titulo: "O mascaramento acontece antes da inferência, não depois",
          escolha:
            "Ler o PDF localmente, identificar e substituir os dados pessoais por marcadores estáveis, e só então chamar o modelo. O provedor recebe a estrutura e os números financeiros; nunca recebe quem assinou. O mapa de substituição fica no perímetro, então o revisor humano vê o documento reidratado.",
          descartado:
            "Enviar o documento como veio e confiar na política de retenção do provedor, que é o caminho mais curto e o que a maioria faz.",
          custo:
            "Uma camada a mais para construir e manter, e o risco de mascarar demais e tirar contexto que a análise precisava. Em troca, o dado pessoal nunca sai do perímetro — a garantia deixa de depender do contrato com o fornecedor e passa a ser propriedade da arquitetura.",
        },
        {
          titulo: "O modelo extrai, o código calcula",
          escolha:
            "O modelo acha e normaliza as cláusulas — valor financiado, prazo, parcela, encargos — devolvendo um objeto validado contra schema. A taxa efetiva é recalculada por código determinístico a partir desses campos.",
          descartado:
            "Pedir ao modelo que leia o contrato e responda direto se o juro é abusivo, que resolveria tudo numa chamada.",
          custo:
            "Dois passos em vez de um, e um schema para manter conforme aparecem contratos com estrutura diferente. Em troca, o número é reproduzível e defensável: dizer que um juro é abusivo é aritmética mais um limiar, e resposta plausível que ninguém consegue refazer não se sustenta numa contestação.",
        },
        {
          titulo: "Abusivo em relação a uma referência pública, não a um número fixo",
          escolha:
            "Comparar a taxa recalculada com a média publicada para aquela modalidade de crédito no período do contrato.",
          descartado:
            "Fixar um limiar no código e tratar tudo acima dele como abusivo.",
          custo:
            "Depender de uma fonte externa e lidar com contratos de modalidade ambígua. Em troca, a conclusão vem acompanhada do ponto de comparação — vira afirmação verificável em vez de opinião do sistema.",
        },
      ],
      resultado: [
        "A análise que exigia leitura integral de cada contrato passou a ser assistida: o especialista revisa em vez de procurar.",
        "Cada número extraído vem acompanhado da cláusula de origem, então conferir é ler um trecho e não o contrato inteiro.",
        "Nenhum dado pessoal de cliente é enviado ao provedor do modelo — o PDF é lido e mascarado dentro do perímetro antes de qualquer chamada.",
      ],
      aprendizado:
        "Privacidade tratada como etapa do pipeline é verificável; tratada como cláusula de contrato com o fornecedor, é promessa. Construir o mascaramento como parte da arquitetura custou mais no começo e eliminou a conversa sobre confiar no provedor.",
      stack: ["Python", "FastAPI", "Mistral AI", "Presidio", "pdfplumber", "Pydantic"],
    },
  ],

  cenas: {
    trilho: {
      inicio: "Início",
      passei: "Por onde passei",
      casos: "O que eu construí",
      time: "O time",
      contato: "Fale comigo",
    },
    passei: {
      rotulo: "Por onde passei",
      empresa: "Grupo Studio · nov/2025 — hoje",
      titulo: ["Cinco setores.", "O mesmo olhar."],
      texto:
        "Comecei no marketing. Hoje estou perto do jurídico. Em cada setor, a mesma pergunta: onde está o gargalo?",
      marcos: { inicio: "Início", hoje: "Hoje" },
      etiquetas: { interno: "Uso interno", clientes: "Para clientes", proprio: "Produto próprio" },
      convite: "Clique num andar que eu te levo.",
      setores: [
        {
          id: "marketing",
          nome: "Marketing",
          marco: "inicio",
          sistemas: [{ nome: "Quiz de leads com LLM" }],
          titulo: "Um quiz que qualifica o lead",
          descricao:
            "Uma LLM lê as respostas do quiz, orienta o lead para o produto que mais combina, cadastra no CRM e gera um gráfico da similaridade dele com cada produto.",
          resultados: [],
          fala: "Foi aqui que tudo começou.",
          agente: "mensageiro",
        },
        {
          id: "corporate",
          nome: "Corporate",
          sistemas: [{ nome: "Classificação de clientes" }],
          titulo: "Clientes classificados pelos próprios dados",
          descricao:
            "Classificação automática de cada cliente a partir dos dados dele, como conta de luz e número de colaboradores.",
          resultados: [],
          fala: "Aqui os dados viraram critério.",
          agente: "triador",
        },
        {
          id: "operacional",
          nome: "Operacional",
          sistemas: [
            { nome: "Fluxos manuais → automáticos" },
            { nome: "16 mi de linhas", caso: "ingestao-em-escala" },
          ],
          titulo: "Do manual ao automático",
          descricao:
            "Mapeei o que o time fazia à mão e coloquei para rodar sozinho. Alguns setores ficaram quase 100% automatizados.",
          etiqueta: "interno",
          resultados: [
            { valor: "2×", rotulo: "jobs entregues pelo setor, recorde histórico" },
            { valor: "4d→1d", rotulo: "análise de cada cliente, de 4 dias para 1" },
          ],
          fala: "O operacional foi onde virou rotina.",
          agente: "vigia",
        },
        {
          id: "lei-do-bem",
          nome: "Lei do Bem",
          sistemas: [{ nome: "Laudo técnico com LLM", caso: "laudo-enquadramento" }],
          titulo: "O laudo que sai durante a reunião",
          descricao:
            "Um checklist guiado com a empresa avaliada e um modelo que redige o laudo preliminar de enquadramento, para o especialista revisar.",
          etiqueta: "interno",
          resultados: [],
          fala: "Aqui o modelo escreve e o especialista revisa.",
          agente: "arquiteto",
        },
        {
          id: "juridico",
          nome: "Jurídico",
          marco: "hoje",
          sistemas: [
            { nome: "Plataforma do jurídico" },
            { nome: "Juros em contrato", caso: "contratos-bancarios" },
          ],
          titulo: "Inovação dentro do jurídico",
          descricao:
            "Hoje toco uma plataforma do braço jurídico e aplico IA onde ela encurta o trabalho. A análise de juros em contrato bancário saiu daqui.",
          etiqueta: "interno",
          resultados: [],
          fala: "É aqui que ele está hoje.",
          agente: "escriba",
        },
      ],
      porConta: "Por conta própria",
      proprios: [
        { sistema: "Agente de atendimento", caso: "agente-conversacional", nota: "Vendido a 3 empresas" },
        { sistema: "Economize Milhas", caso: "economize-milhas", nota: "No ar · código aberto" },
      ],
    },
    pranchas: {
      rotulo: "O que eu construí",
      titulo: "Seis sistemas, rodando.",
      verDetalhes: "Ver detalhes",
      fechar: "Fechar",
      anterior: "Sistema anterior",
      proximo: "Próximo sistema",
      rodando: "rodando",
      montando: "Um segundo: desenho a planta antes de ela rodar.",
      montado: "Pronta. Agora ela roda sozinha.",
      arquitetura: "arquitetura",
      escolha: "escolha um cenário",
      vazio: "Escolha um cenário acima para rodar o sistema.",
      legenda: "— rota · - - condicional",
      simulada: "execução simulada · dados fictícios",
      casoCompleto: "Ver o caso completo",
      porTras: "Por trás da entrega",
      cliente: "cliente",
      agente: "agente",
      taxa: "taxa efetiva {taxa}% a.m. · média publicada 1,90% a.m. (fictícia)",
      milhas: {
        controle: "Seu custo por milheiro",
        passagem: "R$ 1.800 em dinheiro, ou 60.000 milhas + R$ 80 (exemplo)",
        calculo: "60 milheiros × R$ {m} + R$ 80 = R$ {total}",
        emMilhas: "Para você, vale mais em milhas.",
        emDinheiro: "Para você, vale mais pagar em dinheiro.",
        falaMilhas: "Com o seu milheiro, a milha vale mais. Suba o custo e veja virar.",
        falaDinheiro: "A sua milha está cara: pague em dinheiro. A resposta é sua, não universal.",
        nota: "versão simplificada da conta do app",
      },
      itens: [
        {
          id: "atendimento",
          nome: "Arquitetura agêntica de atendimento",
          caso: "agente-conversacional",
          setor: "Comercial · 3 empresas",
          dono: "guardiao",
          titulo: "Atende no WhatsApp, agenda na agenda real e sabe a hora de chamar um humano.",
          numero: "em produção no comercial de 3 empresas · 14 cenários de avaliação em CI",
          fala: "Ele pode escrever o que quiser. Preço fora do catálogo não sai daqui.",
          reacao: "Passou pelo guard. Conferido.",
          corpo:
            "Uma arquitetura só, adaptada a cada empresa: recebe o cliente, leva os dados ao CRM, marca a reunião e entrega o especialista com o briefing pronto.",
          stack: ["LangGraph", "Python", "FastAPI", "PostgreSQL", "RAG", "LLM", "Langfuse", "Docker"],
          porTras: [
            "O guard roda sobre o texto pronto, depois de compor: a saída do modelo é entrada não confiável.",
            "Estado tipado em vez de dicionário solto.",
            "Telefone pseudonimizado antes de sair do processo.",
            "Dois motores, trocados por variável de ambiente: rollback sem redeploy.",
          ],
          nos: {
            carregar: { rotulo: "carregar", sub: "memória" },
            entender: { rotulo: "entender", sub: "intenção" },
            decidir: { rotulo: "decidir", sub: "roteia" },
            recuperar: { rotulo: "recuperar", sub: "catálogo · RAG" },
            agendar: { rotulo: "agendar", sub: "agenda real" },
            compor: { rotulo: "compor" },
            guard: { rotulo: "guard", sub: "barreira de saída" },
            persistir: { rotulo: "persistir", sub: "Postgres · CRM" },
            handoff: { rotulo: "handoff", sub: "humano + briefing" },
          },
          cenarios: [
            {
              rotulo: "Atendem sábado?",
              cliente: "Atendem sábado?",
              caminho: ["carregar", "entender", "decidir", "agendar", "compor", "guard", "persistir"],
              eventos: {
                entender: { t: "intenção: horário · dia: sábado" },
                decidir: { t: "rota → agendar" },
                agendar: {
                  t: "agenda real: sáb 10h · sáb 14h",
                  fala: ["arquiteto", "O horário veio da agenda de verdade. O modelo só escreveu a frase em volta."],
                },
                guard: { t: "ok: nenhum preço, nenhum prazo inventado" },
              },
              resposta: "Atendemos! Tenho sábado às 10h ou às 14h. Qual fica melhor?",
            },
            {
              rotulo: "Quanto custa aquele da loja?",
              cliente: "Quanto custa aquele da loja?",
              caminho: ["carregar", "entender", "decidir", "recuperar", "compor", "guard", "persistir", "handoff"],
              eventos: {
                entender: { t: "intenção: preço · produto: ambíguo" },
                recuperar: { t: "catálogo: item não identificado" },
                compor: { t: "rascunho: “Fica R$ 1.299 à vista.”" },
                guard: {
                  t: "~~“Fica R$ 1.299 à vista.”~~ preço fora do catálogo",
                  mal: true,
                  fala: ["guardiao", "Esse preço não está no catálogo. Não passa."],
                },
                handoff: { t: "briefing → especialista", fala: ["mensageiro", "Chamei um humano, com o resumo da conversa."] },
              },
              resposta: "Esse eu confirmo com um especialista. Já passei seu pedido para ele.",
            },
            {
              rotulo: "Quero falar com alguém",
              cliente: "Quero falar com alguém",
              caminho: ["carregar", "entender", "decidir", "recuperar", "compor", "guard", "persistir", "handoff"],
              eventos: {
                carregar: { t: "memória: a conversa de ontem", fala: ["vigia", "Ele lembra de ontem. Nada se perde no redeploy."] },
                decidir: { t: "rota → humano" },
                handoff: {
                  t: "briefing → especialista",
                  fala: ["mensageiro", "Ninguém conta a história de novo: o especialista recebe o briefing, não a transcrição."],
                },
              },
              resposta: "Claro. Passei sua conversa para um especialista, ele te chama aqui mesmo.",
            },
          ],
        },
        {
          id: "diagnostico",
          nome: "Ecossistema de diagnóstico",
          caso: "ingestao-em-escala",
          setor: "Operações",
          dono: "vigia",
          titulo: "O diagnóstico de cada cliente caiu de 4 dias para 1. As entregas dobraram.",
          numero: "análise 4 dias → 1 · entregas 2×, recorde histórico · 10+ RPAs em produção",
          fala: "Os robôs rodam de madrugada. Eu fico de olho neles.",
          reacao: "Viu? Li o print do robô antes de alguém chegar.",
          corpo:
            "API onde havia; onde não havia, robôs em VMs. Os documentos caem em pastas estruturadas, um importador colunar cruza tudo e, se um robô quebra de madrugada, uma IA lê o print do erro antes de alguém chegar.",
          stack: ["Python", "Playwright", "OpenCV", "LLM", "DuckDB", "Polars", "Parquet"],
          porTras: [
            "Equipes inteiras saíram do trabalho operacional.",
            "Colunar e fora da memória, em vez de linha a linha: 16 mi de linhas no hardware do escritório.",
            "Fui o primeiro profissional da área; a equipe que formei hoje atende outros setores.",
          ],
          nos: {
            portais: { rotulo: "portais", sub: "sem API" },
            apis: { rotulo: "APIs" },
            rpa: { rotulo: "10+ RPAs", sub: "VMs" },
            pastas: { rotulo: "pastas", sub: "estruturadas" },
            import: { rotulo: "importador", sub: "colunar" },
            diag: { rotulo: "diagnóstico", sub: "do cliente" },
            prints: { rotulo: "print do erro", sub: "madrugada" },
            ia: { rotulo: "IA vigia", sub: "LLM com visão" },
          },
          cenarios: [
            {
              rotulo: "Uma noite normal",
              caminho: ["portais", "rpa", "pastas", "import", "diag"],
              eventos: {
                rpa: { t: "robôs baixam os documentos de cada cliente" },
                pastas: { t: "documentos em pastas estruturadas" },
                import: {
                  t: "16 mi de linhas, em colunas, fora da memória",
                  fala: ["triador", "Separo antes de processar: só as colunas do cruzamento, direto do disco."],
                },
                diag: { t: "diagnóstico pronto: 1 dia, não 4", fala: ["vigia", "De manhã, o diagnóstico já está na mesa."] },
              },
            },
            {
              rotulo: "Um robô quebra",
              caminho: ["portais", "rpa", "prints", "ia", "rpa", "pastas", "import", "diag"],
              eventos: {
                rpa: { t: "robô parou numa tela inesperada", mal: true },
                prints: { t: "print do erro salvo", mal: true },
                ia: {
                  t: "IA lê o print: corrige ou deixa o diagnóstico para a manhã",
                  fala: ["vigia", "Quebrou de madrugada? Eu leio o print antes de alguém chegar."],
                },
                "rpa#2": { t: "robô volta a rodar" },
                diag: { t: "diagnóstico pronto mesmo assim" },
              },
            },
          ],
        },
        {
          id: "contratos",
          nome: "Leitura de contratos com IA",
          caso: "contratos-bancarios",
          setor: "Jurídico",
          dono: "escriba",
          titulo: "Juros abusivos encontrados em contrato bancário sem o modelo ver o cliente.",
          numero: "cada número sai com a cláusula de onde veio",
          fala: "O modelo nunca viu quem assinou. Troquei os nomes antes de ele ler.",
          reacao: "Nomes trocados. O modelo só vê [PESSOA_1].",
          corpo:
            "O contrato é mascarado antes de qualquer inferência. O modelo só extrai os campos; a taxa é calculada em código e comparada a uma referência pública.",
          stack: ["Python", "FastAPI", "Mistral AI", "Presidio", "pdfplumber", "Pydantic"],
          porTras: [
            "O mascaramento acontece antes da inferência, não depois.",
            "O modelo extrai, o código calcula.",
            "Abusivo em relação a uma referência pública, não a um número fixo.",
          ],
          nos: {
            pdf: { rotulo: "contrato", sub: "PDF" },
            mask: { rotulo: "mascarar", sub: "Presidio" },
            llm: { rotulo: "extrair", sub: "LLM · Pydantic" },
            calc: { rotulo: "calcular", sub: "em código" },
            ref: { rotulo: "referência", sub: "média publicada" },
            res: { rotulo: "resultado", sub: "número + cláusula" },
          },
          cenarios: [
            {
              rotulo: "Analisar contrato fictício",
              caminho: ["pdf", "mask", "llm", "calc", "res"],
              eventos: {
                pdf: { t: "contrato fictício · 31 páginas" },
                mask: {
                  t: "Maria S. → [PESSOA_1] · CPF → [CPF_1]",
                  fala: ["escriba", "Dado pessoal não entra no prompt. Ele só lê [PESSOA_1]."],
                },
                llm: { t: "prazo 48 · financiado R$ 20.000 · parcela R$ 712" },
                calc: { t: "{taxa}", fala: ["guardiao", "O modelo leu os números. Quem fez a conta foi o código."] },
                res: { t: "acima da referência · cláusula 4.2 anexada", mal: true },
              },
            },
          ],
        },
        {
          id: "leads",
          nome: "Captação de leads com LLM",
          dominio: "Marketing",
          setor: "Marketing",
          dono: "triador",
          titulo: "Um quiz com LLM que qualifica o lead e aposentou um CRM pago.",
          numero: "substituiu um CRM com atendimento integrado de alto custo mensal",
          fala: "Separo o lead antes de ele chegar no time. Ninguém perde tempo com ficha fria.",
          reacao: "Esse eu já separei. Vai qualificado.",
          corpo:
            "O lead responde o quiz, um LLM qualifica as respostas e a gestão do setor fica num lugar só. Os leads seguem para o time de expansão fechar contrato.",
          // PENDENTE: a stack do quiz (pedida ao Juliano).
          stack: ["LLM"],
          porTras: ["Menos uma mensalidade: o CRM pago saiu.", "A gestão de leads do setor ficou num lugar só."],
          nos: {
            quiz: { rotulo: "quiz", sub: "lead responde" },
            llm: { rotulo: "qualificar", sub: "LLM" },
            base: { rotulo: "base de leads", sub: "um lugar só" },
            time: { rotulo: "time de expansão", sub: "fecha contrato" },
          },
          cenarios: [
            {
              rotulo: "Um lead responde",
              caminho: ["quiz", "llm", "base", "time"],
              eventos: {
                quiz: { t: "respostas do lead recebidas" },
                llm: {
                  t: "lead qualificado pelas respostas",
                  fala: ["triador", "Separar antes de processar. O time recebe o lead já qualificado."],
                },
                base: { t: "lead registrado, sem CRM pago" },
                time: { t: "distribuído ao time de expansão", fala: ["mensageiro", "Chegou com contexto, não cru."] },
              },
            },
          ],
        },
        {
          id: "laudo",
          nome: "Laudo técnico com LLM",
          caso: "laudo-enquadramento",
          setor: "Inovação · Lei do Bem",
          dono: "arquiteto",
          titulo: "O rascunho do laudo técnico sai antes de a reunião acabar.",
          numero: "o especialista entra para revisar, não para redigir",
          fala: "O que faltou vira pendência. O modelo aponta a lacuna, não preenche.",
          reacao: "Uma chamada por projeto. Lacuna vira pendência.",
          corpo:
            "Os dados de cada projeto entram durante a reunião; uma chamada por projeto e mais uma para a conclusão. Quando falta informação, o laudo diz o que falta em vez de inventar.",
          stack: ["Next.js", "TypeScript", "React", "LLM", "pdfmake", "Vercel"],
          porTras: [
            "Uma chamada por projeto, mais uma para a conclusão.",
            "Erro trafega por código, não por mensagem.",
            "Checklist de 5 etapas antes de qualquer texto.",
          ],
          nos: {
            reuniao: { rotulo: "reunião", sub: "dados do projeto" },
            proj: { rotulo: "1 chamada", sub: "por projeto" },
            concl: { rotulo: "conclusão", sub: "1 chamada" },
            pdf: { rotulo: "laudo", sub: "PDF" },
            rev: { rotulo: "especialista", sub: "revisa" },
          },
          cenarios: [
            {
              rotulo: "Gerar laudo",
              caminho: ["reuniao", "proj", "concl", "pdf", "rev"],
              eventos: {
                reuniao: { t: "checklist guiado: 5 etapas" },
                proj: { t: "seção do projeto redigida" },
                pdf: { t: "laudo preliminar em PDF" },
                rev: {
                  t: "revisão do responsável técnico",
                  fala: ["arquiteto", "Antes da ferramenta, o checklist. O gargalo era o rascunho, não a revisão."],
                },
              },
            },
            {
              rotulo: "Faltou uma informação",
              caminho: ["reuniao", "proj", "concl", "pdf", "rev"],
              eventos: {
                proj: {
                  t: "pendência: dado não informado",
                  mal: true,
                  fala: ["arquiteto", "Faltou dado? Vira pendência no laudo. Nada é inventado."],
                },
                pdf: { t: "laudo sai com a pendência marcada" },
              },
            },
          ],
        },
        {
          id: "milhas",
          nome: "Economize Milhas",
          caso: "economize-milhas",
          setor: "Produto próprio · código aberto",
          dono: "mensageiro",
          titulo: "Milhas ou dinheiro? Depende de quanto a sua milha custou.",
          numero: "no ar · código aberto · 328 testes",
          fala: "Mexe no seu milheiro e veja a resposta virar.",
          reacao: "A conta usa o seu milheiro, não um preço universal.",
          corpo:
            "Todo comparador responde igual para todo mundo, como se a milha tivesse um preço universal. Aqui a conta usa o que a milha custou para você.",
          stack: ["Next.js", "TypeScript", "React", "Tailwind", "Supabase", "Vitest", "Vercel"],
          porTras: ["O app funciona inteiro com tudo em branco.", "328 testes cobrindo do cálculo à interface."],
          nos: {
            entrada: { rotulo: "sua milha", sub: "custo do milheiro" },
            calc: { rotulo: "cálculo", sub: "testado" },
            milhas: { rotulo: "em milhas" },
            din: { rotulo: "em dinheiro" },
          },
          cenarios: [],
        },
      ],
    },
    construi: {
      rotulo: "O que eu construí",
      anterior: "Sistema anterior",
      proximo: "Próximo sistema",
      gargalo: "Gargalo",
      resultado: "Resultado",
      porTras: "Por trás da entrega",
      casoCompleto: "Ver o caso completo",
      agente: {
        instrucao: "Mande uma mensagem",
        ficticia: "Conversa fictícia",
        simulacoes: [
          {
            pergunta: "Atendem sábado?",
            caminho: ["carregar", "entender", "decidir", "agendar", "compor", "guard", "persistir"],
            dados: [{ no: "agendar", texto: "agenda real: sáb 10h · sáb 14h" }],
            resposta: "Atendemos! Tenho sábado às 10h ou às 14h. Qual fica melhor?",
            anfitriao: "arquiteto",
            fala: ["Repara: o horário veio da agenda de verdade.", "O modelo só escreveu a frase em volta."],
          },
          {
            pergunta: "Quanto custa aquele da loja?",
            caminho: ["carregar", "entender", "decidir", "recuperar", "compor", "guard", "persistir", "handoff"],
            barrado: "“Fica R$ 1.299 à vista.”",
            dados: [{ no: "handoff", texto: "briefing" }],
            resposta: "Esse eu confirmo com um especialista. Já passei seu pedido para ele.",
            anfitriao: "guardiao",
            fala: ["Esse preço não está no catálogo. Não passa.", "Chamei um humano, com o resumo da conversa."],
          },
          {
            pergunta: "Quero falar com alguém",
            caminho: ["carregar", "entender", "decidir", "recuperar", "compor", "guard", "persistir", "handoff"],
            dados: [
              { no: "carregar", texto: "memória: a conversa de ontem" },
              { no: "handoff", texto: "briefing" },
            ],
            resposta: "Claro. Passei sua conversa para um especialista, ele te chama aqui mesmo.",
            anfitriao: "mensageiro",
            fala: ["Ninguém precisa contar a história de novo.", "O especialista recebe o briefing, não a transcrição."],
          },
        ],
      },
      contratos: {
        instrucao: "Passe o mouse num número",
        ficticio: "Contrato fictício",
        passos: ["Contrato", "Máscara", "Modelo", "Código"],
        campos: { prazo: "prazo", financiado: "financiado", parcela: "parcela" },
        taxaEfetiva: "taxa efetiva",
        mediaPublicada: "média publicada",
        acima: "Acima da referência",
        dentro: "Dentro da referência",
        fala: ["O modelo nunca viu quem assinou.", "Troquei os nomes antes de ele ler."],
      },
      ingestao: {
        linhaALinha: "Linha a linha",
        emColunas: "Em colunas",
        memoria: "Memória do notebook",
        tabela: "Eventos trabalhistas",
        estadoLinha: "Tudo em memória: a importação arrasta e parece travada.",
        estadoColuna: "Só as colunas do cruzamento, lidas direto do disco.",
        persistido: "Conversão gravada em disco: reexecutar não recomeça do zero.",
        escala: "16 mi+ linhas numa apuração",
        fala: ["Isso aqui quebrava em escala.", "Em colunas, fora da memória, cabe no notebook."],
      },
      laudo: {
        gerar: "Gerar laudo",
        faltou: "Faltou uma informação",
        checklist: "Checklist guiado",
        etapa: "Etapa",
        projeto: "Projeto",
        conclusao: "Conclusão",
        chamada: "1 chamada",
        secao: "Seção",
        pendencia: "Pendência: dado não informado",
        rodape: "Laudo preliminar · revisão de responsável técnico habilitado",
        fala: ["O que faltou vira pendência.", "O modelo aponta a lacuna, não preenche."],
      },
      milhas: {
        preco: "Preço em dinheiro (R$)",
        milhas: "Milhas pedidas",
        taxas: "Taxas (R$)",
        milheiro: "Seu custo por milheiro (R$)",
        emMilhas: "Em milhas",
        emDinheiro: "Em dinheiro",
        vereditoMilhas: "Para você, vale mais em milhas.",
        vereditoDinheiro: "Para você, vale mais pagar em dinheiro.",
        nota: "Versão simplificada da conta que o app faz.",
        verNoAr: "Ver o app no ar",
        fala: ["Mude o seu milheiro e veja a resposta virar.", "A milha não tem preço universal."],
      },
    },
    time: {
      rotulo: "O time",
      titulo: ["Seis agentes,", "seis regras minhas."],
      texto: "Cada um existe porque eu sigo uma regra.",
      dica: { mouse: "Passe o mouse para conhecer.", toque: "Toque em um para conhecer." },
      montagem: { carimbo: "conferido" },
      rotulos: { porQue: "Por que está aqui", onde: "Onde isso aparece" },
      fichas: {
        escriba: {
          regra: "Dado pessoal não entra no prompt.",
          porQue:
            "Privacidade tratada como etapa do pipeline é verificável. Tratada como cláusula com o fornecedor, é promessa.",
          onde: { texto: "Contratos: a máscara antes do modelo", caso: "contratos-bancarios" },
        },
        triador: {
          regra: "Separar antes de processar.",
          porQue:
            "O trabalho pesado só fica rápido quando o dado chega separado: em colunas, fora da memória, convertido uma vez.",
          onde: { texto: "16 milhões de linhas: a leitura em colunas", caso: "ingestao-em-escala" },
        },
        guardiao: {
          regra: "O modelo propõe, o código confere.",
          porQue:
            "Trato saída de modelo como entrada não confiável. Pedir no prompt reduz a chance de erro; conferir a saída elimina o caso.",
          onde: { texto: "Agente de atendimento: o nó guard", caso: "agente-conversacional" },
        },
        arquiteto: {
          regra: "O gargalo vem antes da ferramenta.",
          porQue:
            "Antes de escolher modelo ou framework, procuro onde o trabalho trava. A ferramenta é consequência.",
          onde: { texto: "Laudo: o checklist de 5 etapas", caso: "laudo-enquadramento" },
        },
        mensageiro: {
          regra: "Entregar com contexto, não cru.",
          porQue:
            "Passar uma conversa para um humano é entregar o briefing pronto, não a transcrição inteira.",
          onde: { texto: "Agente de atendimento: o handoff com briefing", caso: "agente-conversacional" },
        },
        vigia: {
          regra: "Penso funcionando lá na frente.",
          porQue: "Analiso tudo: segurança, escala. Penso no que estou fazendo funcionando lá na frente.",
          onde: { texto: "Agente de atendimento: rollback sem redeploy", caso: "agente-conversacional" },
        },
      },
    },
    contato: {
      rotulo: "Fale comigo",
      titulo: "Vamos construir o próximo?",
      texto: "Tem um projeto ou um processo travado? Me conta, e eu volto com o desenho do sistema.",
      fala: "Escreve que eu levo. Ele responde.",
    },
  },
};
