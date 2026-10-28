"use client";

import { useRef, useState } from "react";

import { Familiar } from "@/components/abertura/Familiar";
import { faiscador } from "@/components/faiscas";
import type { Cenas, NomeFamiliar } from "@/conteudo/tipos";
import { Letras } from "./Letras";
import { estreita, pontoEm, useMontagem } from "./montagem";
import { ditarLetras, lancarEnvelope, riscarComLaser } from "./oficio";
import { Voador, type Voo } from "./Voador";

/**
 * Cena 5. A frase, as três saídas e o time reunido em volta dele. O
 * Mensageiro espera junto do e-mail: chega mais perto quando o mouse passa
 * no botão, e com o mouse em cima dele dá um laço no ar e lança o envelope
 * no botão de e-mail, que acende. No clique, sai voando com a carta.
 *
 * Na primeira chegada, a cena se monta em silêncio: o Escriba passa por
 * baixo da frase e as letras saem do livro, o Arquiteto risca os botões com
 * o laser, o time se reúne e o Mensageiro chega voando com o envelope e o
 * lança no botão de e-mail antes de pousar.
 *
 * Com o mouse em cima, cada agente mostra a habilidade dele e o nome: o
 * Arquiteto risca um nó com o laser, o Escriba solta letras, o Guardião ergue
 * o escudo, o Triador separa linhas em colunas, o Vigia acende o farol e o
 * Mensageiro sai com um envelope. Em cima dele, ele estala os dedos e o time
 * inteiro responde, em onda.
 */
export function Contato({
  textos,
  email,
  linkedin,
  github,
  primeiroNome,
  nomes,
  rodape,
}: {
  textos: Cenas["contato"];
  email: string;
  linkedin: string;
  github: string;
  primeiroNome: string;
  nomes: Record<NomeFamiliar, string>;
  rodape: React.ReactNode;
}) {
  const [voando, setVoando] = useState(false);
  const [voos, setVoos] = useState<Voo[]>([]);
  const titulo = useRef<HTMLHeadingElement>(null);
  const botaoEmail = useRef<HTMLAnchorElement>(null);
  const pouso = useRef<HTMLSpanElement>(null);
  const rodaRef = useRef<HTMLDivElement>(null);
  const relogios = useRef<ReturnType<typeof setTimeout>[]>([]);
  const roda: NomeFamiliar[] = ["escriba", "triador", "guardiao"];
  const roda2: NomeFamiliar[] = ["arquiteto", "vigia"];
  // A escrita leva o tempo das letras; o Escriba anda junto com elas.
  const ESCRITA = INICIO_LETRAS + textos.titulo.length * PASSO_LETRA + 150;

  /** No meio do laço, o envelope sai da mão dele para o botão de e-mail. */
  const lancarDaMao = (atraso: number) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    relogios.current.push(
      setTimeout(() => {
        const env = pouso.current?.querySelector(".carta-envelope")?.getBoundingClientRect();
        if (env && raiz.current && botaoEmail.current) lancarEnvelope(raiz.current, env, botaoEmail.current);
      }, atraso),
    );
  };

  const raiz = useMontagem<HTMLDivElement>(
    "contato",
    [
      ["vazia", 350],
      ["escrita", ESCRITA],
      ["botoes", 350 + 3 * RISCO_BOTAO + 250],
      ["pouso", 1750],
    ],
    (estado, el) => {
      const inicio = pontoEm(el, titulo.current, 0, 1, -24, 4);
      const fim = pontoEm(el, titulo.current, 1, 1, -24, 4);
      // No celular o e-mail ocupa a linha: ele risca de cima dele.
      const email = estreita()
        ? pontoEm(el, botaoEmail.current, 1, 0, -40, -58)
        : pontoEm(el, botaoEmail.current, 0, 0, -64, -4);
      if (estado === "vazia" && inicio) setVoos([{ nome: "escriba", ...inicio }]);
      else if (estado === "escrita" && fim) {
        setVoos([{ nome: "escriba", ...fim, dur: ESCRITA }]);
        const letras = [...el.querySelectorAll<HTMLElement>(".letra-escrita")];
        relogios.current.push(...ditarLetras(el, letras, INICIO_LETRAS, PASSO_LETRA));
      } else if (estado === "botoes" && email) {
        // Ele fica junto do e-mail e risca um botão de cada vez.
        setVoos([{ nome: "arquiteto", ...email }]);
        el.querySelectorAll(".contato-botao").forEach((b, k) =>
          relogios.current.push(setTimeout(() => void riscarComLaser(el, b, RISCO_BOTAO - 30), 350 + k * RISCO_BOTAO)),
        );
      } else if (estado === "pouso") {
        // Ele chega de trás dos botões, voando com o envelope, lança o
        // envelope no e-mail e pousa no lugar dele.
        const destino = pontoEm(el, pouso.current, 0, 0, 0, 0);
        const partida = pontoEm(el, botaoEmail.current?.parentElement ?? null, 1, 0, 30, -80);
        if (!destino || !partida) return setVoos([]);
        const mensageiro = { nome: "mensageiro" as const, espelho: true };
        setVoos([{ ...mensageiro, ...partida, carta: true }]);
        relogios.current.push(
          setTimeout(() => setVoos([{ ...mensageiro, ...destino, dur: 950, carta: true, gesto: "voar" }]), 80),
          setTimeout(() => {
            const env = el.querySelector(".voador-envelope")?.getBoundingClientRect();
            if (env && botaoEmail.current) lancarEnvelope(el, env, botaoEmail.current);
            setVoos([{ ...mensageiro, ...destino }]);
          }, 1080),
        );
      } else {
        relogios.current.forEach(clearTimeout);
        relogios.current = [];
        el.querySelectorAll(".letra-ditada, .risco-laser, .faisca-voa").forEach((x) => x.remove());
        setVoos([]);
      }
    },
  );

  return (
    <div ref={raiz} className="contato relative flex flex-col items-center text-center">
      <p className="rotulo !text-acento">{textos.rotulo}</p>
      <h2 ref={titulo} aria-label={textos.titulo} className="mt-6 font-gravura text-[2.6rem] leading-tight sm:text-6xl">
        <Letras texto={textos.titulo} classe="letra-escrita" />
      </h2>
      <p className="contato-texto mt-5 max-w-[46ch] text-lg text-tinta-suave">{textos.texto}</p>

      <div className="relative mt-9 flex flex-wrap justify-center gap-4">
        <a
          ref={botaoEmail}
          href={`mailto:${email}`}
          onClick={() => setVoando(true)}
          className="contato-botao botao-email rounded-[4px] bg-acento px-6 py-3 text-[15px] text-fundo transition-colors hover:bg-acento-forte"
        >
          {email}
        </a>
        <a
          href={linkedin}
          target="_blank"
          rel="noreferrer"
          className="contato-botao rounded-[4px] border border-acento px-6 py-3 text-[15px] text-acento transition-colors hover:bg-acento-fraco"
        >
          LinkedIn
        </a>
        <a
          href={github}
          target="_blank"
          rel="noreferrer"
          className="contato-botao rounded-[4px] border border-acento px-6 py-3 text-[15px] text-acento transition-colors hover:bg-acento-fraco"
        >
          GitHub
        </a>

        {/* o Mensageiro, esperando a carta */}
        {/* No celular ele mora na linha de baixo dos botões, com o balão. */}
        <div className="contato-mensageiro flex w-full items-center justify-center gap-3 md:absolute md:top-full md:left-0 md:mt-5 md:w-auto md:-translate-x-[55%]">
          <div className="balao balao-direita text-left">
            <span className="sr-only">{nomes.mensageiro}: </span>
            {textos.fala}
          </div>
          <span
            ref={pouso}
            className="mensageiro-carta block"
            data-voando={voando}
            onMouseEnter={() => lancarDaMao(LACO / 2)}
          >
            <span className="carta-corpo">
              <Familiar nome="mensageiro" className="familiar-vivo size-12 -scale-x-100" />
              <span className="carta-envelope" />
            </span>
          </span>
        </div>
      </div>

      <div ref={rodaRef} className="contato-roda mt-16 flex items-end gap-2.5 sm:mt-24 sm:gap-10" aria-hidden>
        {roda.map((nome, n) => (
          <Membro key={nome} nome={nome} rotulo={nomes[nome]} n={n} letras={nome === "escriba" ? primeiroNome : undefined} />
        ))}
        <span
          className="contato-eu relative"
          onMouseEnter={() => {
            // O Arquiteto e o envelope do Mensageiro entram na onda do estalo
            // na vez deles (o CSS faz o resto).
            const arquiteto = rodaRef.current?.querySelector<HTMLElement>('[data-nome="arquiteto"]');
            if (arquiteto) setTimeout(() => desenharComLaser(arquiteto), 420 + 3 * 90);
            lancarDaMao(900 + LACO / 2);
          }}
        >
          <span className="sprite-juliano block h-24 sm:h-28" />
          <span className="eu-estalo" />
          <span className="sr-only">{primeiroNome}</span>
        </span>
        {roda2.map((nome, n) => (
          <Membro key={nome} nome={nome} rotulo={nomes[nome]} n={n + 3} />
        ))}
      </div>
      <div className="mt-px h-px w-full max-w-[42rem] bg-regua" />

      <div className="mt-10">{rodape}</div>

      {voos.map((v) => (
        <Voador key={v.nome} voo={v} rotulo={nomes[v.nome]} />
      ))}
    </div>
  );
}

/**
 * Um agente da roda: o corpo faz o gesto do papel dele; o nome aparece
 * embaixo. As `letras` (só do Escriba) sobem do livro com o mouse em cima.
 */
function Membro({ nome, rotulo, n, letras }: { nome: NomeFamiliar; rotulo: string; n: number; letras?: string }) {
  return (
    <span
      className="roda-membro"
      data-nome={nome}
      style={{ "--n": n } as React.CSSProperties}
      onMouseEnter={nome === "arquiteto" ? (e) => desenharComLaser(e.currentTarget) : undefined}
    >
      <span className="roda-corpo">
        <Familiar nome={nome} className="familiar-vivo size-11 sm:size-14" />
      </span>
      {nome === "arquiteto" && (
        <svg className="roda-desenho">
          <rect />
          <line />
        </svg>
      )}
      {nome === "triador" &&
        LINHAS_TRIADOR.map((l, k) => (
          <span
            key={k}
            className="roda-linha"
            data-col={k % 3}
            style={
              {
                "--sx": `${l[0]}px`,
                "--sy": `${l[1]}px`,
                "--sr": `${l[2]}deg`,
                "--tx": `${((k % 3) - 1) * 13}px`,
                "--ty": `${-14 - Math.floor(k / 3) * 7}px`,
                "--ordem": (k % 3) * 2 + Math.floor(k / 3),
              } as React.CSSProperties
            }
          />
        ))}
      {nome === "vigia" && <span className="roda-farol" />}
      {letras &&
        Array.from(letras).map((l, k) => (
          <span
            key={k}
            className="roda-letra"
            style={{ "--k": k, "--lado": `${(k % 2 ? 1 : -1) * (6 + k * 3)}px` } as React.CSSProperties}
          >
            {l}
          </span>
        ))}
      <span className="roda-nome">{rotulo}</span>
    </span>
  );
}

/** O ritmo da escrita da frase: quando a primeira letra acende e o passo (iguais ao CSS). */
const INICIO_LETRAS = 300;
const PASSO_LETRA = 38;
/** Quanto o Arquiteto leva em cada botão. */
const RISCO_BOTAO = 320;
/** O laço do Mensageiro com o mouse em cima (igual ao `entregar` do CSS). */
const LACO = 1000;

/** Onde cada linha do Triador começa, embaralhada: x, y e giro. */
const LINHAS_TRIADOR: [number, number, number][] = [
  [-24, -34, 35],
  [18, -10, -50],
  [-6, -44, 20],
  [26, -28, -25],
  [-20, -12, 60],
  [6, -38, -40],
];

/** O nó que o Arquiteto risca, em px, acima e à direita do olho dele. */
const NO_CONTATO = { largura: 40, altura: 26, dx: 14, dy: -60 };
const TRACO_CONTATO = 700;

/**
 * O Arquiteto risca um nó com o laser, como nas pranchas: o feixe sai do
 * olho dele, percorre o contorno e solta faíscas onde toca; pronto o nó,
 * ele acende e some.
 */
function desenharComLaser(membro: HTMLElement) {
  if (membro.dataset.desenhando || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const corpo = membro.querySelector(".familiar")?.getBoundingClientRect();
  const rect = membro.querySelector<SVGRectElement>(".roda-desenho rect");
  const linha = membro.querySelector<SVGLineElement>(".roda-desenho line");
  if (!corpo || !rect || !linha) return;
  const base = membro.getBoundingClientRect();
  const olho = { x: corpo.left + corpo.width / 2 - base.left, y: corpo.top + corpo.height * 0.25 - base.top };
  const { largura: w, altura: h } = NO_CONTATO;
  const x0 = olho.x + NO_CONTATO.dx;
  const y0 = olho.y + NO_CONTATO.dy;
  const P = 2 * (w + h);
  rect.setAttribute("x", String(x0));
  rect.setAttribute("y", String(y0));
  rect.setAttribute("width", String(w));
  rect.setAttribute("height", String(h));
  rect.style.strokeDasharray = `${P}`;
  rect.style.strokeDashoffset = `${P}`;
  linha.setAttribute("x1", String(olho.x));
  linha.setAttribute("y1", String(olho.y));
  membro.dataset.desenhando = "traco";
  // O ponto a `l` do canto de cima à esquerda, no sentido do traço.
  const ponto = (l: number) =>
    l < w
      ? { x: x0 + l, y: y0 }
      : l < w + h
        ? { x: x0 + w, y: y0 + l - w }
        : l < 2 * w + h
          ? { x: x0 + w - (l - w - h), y: y0 + h }
          : { x: x0, y: y0 + h - (l - 2 * w - h) };
  const faiscar = faiscador();
  const inicio = performance.now();
  const quadro = (agora: number) => {
    const t = Math.min(1, (agora - inicio) / TRACO_CONTATO);
    const l = P * t;
    rect.style.strokeDashoffset = `${P - l}`;
    const p = ponto(Math.min(l, P - 0.01));
    linha.setAttribute("x2", String(p.x));
    linha.setAttribute("y2", String(p.y));
    faiscar(membro, p.x, p.y);
    if (t < 1) return void requestAnimationFrame(quadro);
    membro.dataset.desenhando = "pronto";
    setTimeout(() => delete membro.dataset.desenhando, 900);
  };
  requestAnimationFrame(quadro);
}
