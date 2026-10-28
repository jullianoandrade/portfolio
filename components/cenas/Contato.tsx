"use client";

import { useRef, useState } from "react";

import { Familiar } from "@/components/abertura/Familiar";
import type { Cenas, NomeFamiliar } from "@/conteudo/tipos";
import { Letras } from "./Letras";
import { pontoEm, useMontagem } from "./montagem";
import { Voador, type Voo } from "./Voador";

/**
 * Cena 5. A frase, as três saídas e o time reunido em volta dele. O
 * Mensageiro espera junto do e-mail: chega mais perto quando o mouse passa
 * no botão, dá uma volta no ar com o mouse em cima dele e sai voando com a
 * carta no clique.
 *
 * Na primeira chegada, a cena se monta: o Escriba escreve a frase, o
 * Arquiteto desenha os botões, o time se reúne e o Mensageiro pousa.
 *
 * Com o mouse em cima, cada agente faz o gesto do seu papel e mostra o nome;
 * em cima dele, ele estala os dedos e o time inteiro responde com um pulo.
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
  const roda: NomeFamiliar[] = ["escriba", "triador", "guardiao"];
  const roda2: NomeFamiliar[] = ["arquiteto", "vigia"];
  // A escrita leva o tempo das letras; o Escriba anda junto com o cursor.
  const ESCRITA = textos.titulo.length * 38 + 150;

  const raiz = useMontagem<HTMLDivElement>(
    "contato",
    [
      ["vazia", 350],
      ["escrita", ESCRITA],
      ["botoes", 900],
      ["pouso", 700],
    ],
    (estado, el) => {
      const inicio = pontoEm(el, titulo.current, 0, 0, -56, -40);
      const fim = pontoEm(el, titulo.current, 1, 0, 0, -40);
      const email = pontoEm(el, botaoEmail.current, 0, 0, -64, -4);
      if (estado === "vazia" && inicio) setVoos([{ nome: "escriba", ...inicio, fala: textos.montagem.escriba }]);
      else if (estado === "escrita" && fim && email)
        setVoos([
          { nome: "escriba", ...fim, dur: ESCRITA },
          { nome: "arquiteto", ...email },
        ]);
      else if (estado === "botoes") {
        const destino = pontoEm(el, pouso.current, 0, 0, 0, 0);
        setVoos(destino ? [{ nome: "mensageiro", ...destino }] : []);
      } else setVoos([]);
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
        <div className="contato-mensageiro absolute top-full left-0 mt-5 hidden items-center gap-3 md:flex md:-translate-x-[55%]">
          <div className="balao balao-direita text-left">
            <span className="sr-only">{nomes.mensageiro}: </span>
            {textos.fala}
          </div>
          <span ref={pouso} className="mensageiro-carta block" data-voando={voando}>
            <span className="carta-corpo">
              <Familiar nome="mensageiro" className="familiar-vivo size-12 -scale-x-100" />
            </span>
          </span>
        </div>
      </div>

      <div className="contato-roda mt-24 flex items-end gap-6 sm:gap-10" aria-hidden>
        {roda.map((nome, n) => (
          <Membro key={nome} nome={nome} rotulo={nomes[nome]} n={n} />
        ))}
        <span className="contato-eu relative">
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

/** Um agente da roda: o corpo faz o gesto do papel dele; o nome aparece embaixo. */
function Membro({ nome, rotulo, n }: { nome: NomeFamiliar; rotulo: string; n: number }) {
  return (
    <span className="roda-membro" data-nome={nome} style={{ "--n": n } as React.CSSProperties}>
      <span className="roda-corpo">
        <Familiar nome={nome} className="familiar-vivo size-11 sm:size-14" />
      </span>
      <span className="roda-nome">{rotulo}</span>
    </span>
  );
}
