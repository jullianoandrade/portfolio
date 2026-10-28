import { notFound } from "next/navigation";

import { AlternadorIdioma } from "@/components/AlternadorIdioma";
import { Abertura } from "@/components/abertura/Abertura";
import { Familiar } from "@/components/abertura/Familiar";
import { VerDeNovo } from "@/components/abertura/VerDeNovo";
import "@/components/cenas/cenas.css";
import { Contato } from "@/components/cenas/Contato";
import { Deslize } from "@/components/cenas/Deslize";
import { hashDoSistema } from "@/components/cenas/endereco";
import { Pranchas } from "@/components/cenas/Pranchas";
import { Time } from "@/components/cenas/Time";
import { TrilhoVigia } from "@/components/cenas/TrilhoVigia";
import { IDIOMAS, ehIdioma, obterConteudo, outroIdioma } from "@/conteudo";
import { FAMILIARES, type NomeFamiliar } from "@/conteudo/tipos";

/**
 * Só existem os parâmetros gerados em build. Sem isto, um slug inexistente
 * é renderizado dinamicamente e o `notFound()` roda depois do status 200 já
 * ter sido enviado — a página mostra 404 mas responde 200, que é um soft 404
 * e acaba indexado.
 */
export const dynamicParams = false;

/**
 * Decide se a abertura toca, antes da primeira pintura — se esperasse o React,
 * o hero apareceria pronto e depois sumiria para ser montado. Não toca com
 * movimento reduzido nem na segunda visita da sessão. Se o JavaScript da
 * página nunca chegar, a segurança devolve o hero em 20 s.
 */
const DECIDE_ABERTURA = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches&&!sessionStorage.getItem("abertura-vista")){var h=document.documentElement;h.classList.add("abertura");window.__aberturaSeguranca=setTimeout(function(){h.classList.remove("abertura")},20000)}}catch(e){}`;

/**
 * Os três casos da primeira fileira e o familiar que mora em cada um — quem
 * traz o card na abertura. A ordem casa com as três marcas da abertura
 * (`ui.abertura.marcas`): cada dor marcada vira o card da vaga dela. O Guardião fica no de contratos, onde conferir é
 * tudo; o Triador no de dados, que ele arrasta para a vaga.
 */
const PRIMEIRA_FILEIRA: [string, NomeFamiliar][] = [
  ["agente-conversacional", "mensageiro"],
  ["contratos-bancarios", "guardiao"],
  ["ingestao-em-escala", "triador"],
];

/**
 * Onde cada familiar mora no hero, em telas largas: x em % da largura, y em
 * px do topo do hero — as posições do quadro 6 do storyboard.
 */
const POUSOS_HERO: [NomeFamiliar, string, number][] = [
  ["arquiteto", "74.8%", 156],
  ["escriba", "82.5%", 312],
  ["vigia", "100.8%", 62],
];

export async function generateStaticParams() {
  return IDIOMAS.map((idioma) => ({ idioma }));
}

export default async function Home({ params }: { params: Promise<{ idioma: string }> }) {
  const { idioma } = await params;
  if (!ehIdioma(idioma)) notFound();

  const conteudo = obterConteudo(idioma);
  const { perfil, interface: ui, casos, cenas } = conteudo;
  const nomes = ui.abertura.familiares;
  const outro = outroIdioma(idioma);
  const primeiroNome = perfil.nome.split(" ")[0];
  // A linha que o Guardião põe no lugar da frase de efeito: a amplitude do
  // trabalho, contada das pranchas — cresce sozinha quando entra um sistema novo.
  const moradores = new Map(PRIMEIRA_FILEIRA);
  const ordenados = [
    ...PRIMEIRA_FILEIRA.map(([slug]) => casos.find((c) => c.slug === slug)).filter((c) => c !== undefined),
    ...casos.filter((c) => !moradores.has(c.slug)),
  ];
  // Na ordem dos cards, para a frase e a grade contarem a mesma coisa.
  // Conta as pranchas, não só os casos: o que não tem página (o quiz de leads)
  // também é sistema no ar, e entra com o próprio domínio no fim da lista.
  // Em minúscula no meio da frase, mas sigla fica como é: "R&D" não vira "r&d".
  const minuscula = (d: string) =>
    d.replace(/(^|\s)(\p{Lu})(?=\p{Ll})/gu, (_, antes: string, letra: string) => antes + letra.toLocaleLowerCase(idioma));
  const extras = cenas.pranchas.itens.flatMap((p) => (p.caso ? [] : p.dominio ? [p.dominio] : []));
  const dominios = [
    ...new Set([...ordenados.map((c) => c.dominio), ...extras].map(minuscula)),
  ];
  const amplitude = ui.heroAmplitude(cenas.pranchas.itens.length, dominios);
  // A regra de cada familiar, para o balão de quem acompanha as pranchas.
  const regras = Object.fromEntries(FAMILIARES.map((n) => [n, cenas.time.fichas[n].regra])) as Record<NomeFamiliar, string>;
  const trilho = [
    { id: "inicio", nome: cenas.trilho.inicio },
    { id: "construi", nome: cenas.trilho.casos },
    { id: "time", nome: cenas.trilho.time },
    { id: "contato", nome: cenas.trilho.contato },
  ];

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: DECIDE_ABERTURA }} />
      <header data-obra="cabecalho" className="sticky top-0 z-20 bg-fundo/85 backdrop-blur-md">
        <div className="mx-auto max-w-[75rem] px-6">
          <div className="flex h-(--topo) items-center justify-between gap-4 border-b border-regua">
            {/* Já está na home: o nome volta ao início, deslizando como o menu. */}
            <a href="#inicio" className="rotulo !text-tinta">
              {perfil.nome}
            </a>
            <nav className="flex items-center gap-6 lg:gap-8">
              {(
                [
                  ["construi", ui.navegacao.casos],
                  ["time", ui.navegacao.time],
                  ["contato", ui.navegacao.contato],
                ] as const
              ).map(([id, nome]) => (
                <a key={id} href={`#${id}`} className="rotulo hidden transition-colors hover:text-acento md:block">
                  {nome}
                </a>
              ))}
              <AlternadorIdioma atual={idioma} destino={outro} rotulo={ui.trocarIdioma} />
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[75rem] flex-1 px-6">
        <div id="inicio" data-cena>
        {/* ---------------------------------------------------------- hero */}
        {/* Montado pelos familiares na abertura; sem ela, já está pronto. Os
            `data-obra` dizem em que momento cada peça entra, os `data-alvo`
            onde cada familiar trabalha e os `data-pouso` onde ele mora. */}
        <section data-alvo="hero" className="relative pt-16 sm:pt-24">
          <p data-obra="rotulo" className="rotulo">
            {perfil.localizacao} · {perfil.titulo}
          </p>
          <div data-alvo="bloco-nome" className="mt-4 w-fit max-w-full">
            <h1 className="font-gravura text-[3.25rem] leading-none text-acento sm:text-7xl lg:text-[6.5rem]">
              <span className="sr-only">{perfil.nome}</span>
              <span data-alvo="nome" aria-hidden>
                {Array.from(perfil.nome).map((letra, i) => (
                  <span key={i} className="letra" style={{ "--i": i } as React.CSSProperties}>
                    {letra}
                  </span>
                ))}
              </span>
            </h1>
            {/* A frase de efeito ocupa, durante a abertura, o lugar da chamada:
                nada abaixo dela se mexe quando uma sai e a outra entra. */}
            <div className="relative mt-7">
              <p
                data-obra="chamada"
                className="max-w-[620px] text-2xl leading-snug sm:text-[1.875rem] sm:leading-[1.4]"
              >
                {ui.heroChamada}
              </p>
              <p className="frase-efeito absolute inset-x-0 top-0 text-xl sm:text-2xl" aria-hidden>
                <span data-alvo="frase">
                  <span className="frase-texto">{ui.abertura.fraseDeEfeito}</span>
                  <span className="carimbo">{ui.abertura.carimbo}</span>
                </span>
              </p>
            </div>
            <p data-obra="prova" data-alvo="prova" className="mt-6 text-lg text-tinta-suave">
              {amplitude}
            </p>
          </div>

          {/* Quem mora no hero. Na tela larga, nas posições do storyboard; na
              estreita, em fileira abaixo do texto. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block">
            {POUSOS_HERO.map(([nome, x, y], n) => (
              <span
                key={nome}
                data-pouso={nome}
                className="pouso-familiar absolute size-11"
                style={
                  { left: x, top: y, margin: "-22px 0 0 -22px", "--respiro": `${-n * 1.4}s` } as React.CSSProperties
                }
              >
                <Familiar nome={nome} className="size-11" />
                <span className="pouso-nome">{ui.abertura.familiares[nome]}</span>
              </span>
            ))}
            <span
              data-pouso="juliano"
              className="juliano-pouso absolute h-24"
              style={{ left: "91.5%", top: 288, marginLeft: -20 }}
            >
              <span className="pouso-nome">{primeiroNome}</span>
            </span>
          </div>
          <div aria-hidden className="mt-10 flex items-end gap-5 xl:hidden">
            {POUSOS_HERO.map(([nome], n) => (
              <span
                key={nome}
                data-pouso={nome}
                className="pouso-familiar relative block size-10"
                style={{ "--respiro": `${-n * 1.4}s` } as React.CSSProperties}
              >
                <Familiar nome={nome} className="size-10" />
                <span className="pouso-nome">{ui.abertura.familiares[nome]}</span>
              </span>
            ))}
            <span data-pouso="juliano" className="juliano-pouso relative block h-24">
              <span className="pouso-nome">{primeiroNome}</span>
            </span>
          </div>
        </section>

        {/* --------------------------------------------------------- casos */}
        <section id="casos" className="scroll-mt-24 pt-16 pb-16 sm:pb-24">
          <div data-obra="rotulo-casos">
            <p className="rotulo">{ui.navegacao.casos}</p>
            <div className="mt-3 border-t border-regua" />
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Só a primeira fileira: os três que a abertura traz. Os outros
                estão na bancada, a uma rolagem daqui. */}
            {ordenados.slice(0, PRIMEIRA_FILEIRA.length).map((caso, i) => {
              const morador = moradores.get(caso.slug);
              return (
                <div key={caso.slug} className="vaga relative" data-vaga={i}>
                  <a
                    href={hashDoSistema(caso.slug)}
                    className="cartao group flex h-full min-h-[140px] flex-col border border-regua bg-fundo-elevado p-6 transition-colors hover:border-acento"
                  >
                    <p className="font-gravura text-[15px] text-acento">{caso.dominio}</p>
                    <h3 className="mt-3 text-lg leading-snug transition-colors group-hover:text-acento">
                      {caso.titulo}
                    </h3>
                  </a>
                  {morador && (
                    <span
                      data-pouso={morador}
                      aria-hidden
                      className="pouso-familiar absolute size-11"
                      style={{ right: 8, top: -34, "--respiro": `${-i * 1.1}s` } as React.CSSProperties}
                    >
                      <Familiar nome={morador} className="size-11" />
                      <span className="pouso-nome">{ui.abertura.familiares[morador]}</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        </div>

        <div data-obra="resto">
          <section id="construi" data-cena className="cena-tela border-t border-regua">
            <Pranchas textos={cenas.pranchas} nomes={nomes} regras={regras} idioma={idioma} />
          </section>

          <section id="time" data-cena className="cena-tela border-t border-regua">
            <Time textos={cenas.time} nomes={nomes} />
          </section>

          <section id="contato" data-cena className="cena-tela border-t border-regua">
            <Contato
              textos={cenas.contato}
              email={perfil.email}
              linkedin={perfil.linkedin}
              github={perfil.github}
              primeiroNome={primeiroNome}
              nomes={nomes}
              rodape={
                <>
                  <p className="rotulo">
                    {ui.abertura.credito} · <VerDeNovo rotulo={ui.abertura.verDeNovo} />
                  </p>
                  {/* Sem ano: um número que envelhece sozinho só serve para
                      denunciar abandono, e forçaria render dinâmico. */}
                  <p className="rotulo mt-3 !text-tinta-fraca">
                    {perfil.nome} · {perfil.titulo} · {perfil.localizacao}
                  </p>
                </>
              }
            />
          </section>
        </div>
      </main>

      {/* Fora do `data-obra`: a abertura mexe em transform ali, e um pai com
          transform tira o `fixed` do lugar. O trilho se esconde sozinho. */}
      <TrilhoVigia cenas={trilho} rotulo={ui.navegacao.casos} />
      <Deslize />

      {/* Os cards que nascem das marcas na abertura: os da primeira fileira. */}
      <Abertura
        textos={ui.abertura}
        idioma={idioma}
        cards={ordenados.slice(0, PRIMEIRA_FILEIRA.length).map((c) => ({ dominio: c.dominio, titulo: c.titulo }))}
      />
    </>
  );
}
