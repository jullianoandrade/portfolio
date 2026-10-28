"use client";

import { useCallback, useEffect, useRef } from "react";

import { faiscador } from "@/components/faiscas";
import { FAMILIARES, type Abertura as Textos, type NomeFamiliar } from "@/conteudo/tipos";
import { Familiar } from "./Familiar";
import "./abertura.css";

/**
 * A abertura da home — o storyboard do tempo parado seguido do híbrido, em
 * etapas cumulativas:
 *
 *   caos     as dores que pedem um AI engineer, rápidas demais; ele parado
 *   para     ele ergue a mão e o tempo congela; tudo perde a cor
 *   marca    o olhar dele prende uma moldura em três dores, uma por vez,
 *            e a câmera aproxima de cada uma
 *   estalo   ele estala: a câmera recua seca, o tempo volta, o resto é varrido, e cada dor
 *            marcada se desdobra no card do caso que a resolve
 *   time     as faíscas viram os seis agentes
 *   obra     a cena some e o time monta a página real, cada um do seu
 *            jeito: o Arquiteto puxa a caixa do nome com o laser, o Escriba
 *            passa por baixo do nome e as letras saem do livro, o Mensageiro
 *            fecha o card num envelope e o abre na vaga, o Triador desmonta o
 *            dele em linhas e as separa por coluna; ele assiste do canto
 *   revisao  o Guardião investe com o escudo e carimba a frase: não passa
 *   prova    entra o número; o Vigia varre o card e aponta o que quebra
 *   fim      a chamada entra; cada agente pousa onde mora
 *
 * O JavaScript só faz duas coisas: pôr a classe de cada etapa no <html> e
 * medir onde cada peça está e para onde vai. Quem anima é `abertura.css`.
 *
 * Quem decide se a abertura toca é o script inline da home (antes da primeira
 * pintura, para o hero não piscar pronto): sem JavaScript, com movimento
 * reduzido ou na segunda visita da sessão, ela não toca e a página já está ali.
 */

const ETAPAS = [
  ["e-para", 1400],
  ["e-marca", 2200],
  ["e-estalo", 4800],
  ["e-time", 5700],
  ["e-obra", 6900],
  ["e-revisao", 10300],
  ["e-prova", 12300],
  ["e-fim", 14900],
] as const;
const DURACAO = 16300;

/** Quanto a câmera fica em cada marca (igual ao `0.8s` do CSS). */
const PASSO_MARCA = 800;

/** Quanto o Arquiteto leva para puxar a caixa do nome (igual ao CSS). */
const PUXADA = 1300;

/** Onde o Arquiteto fica em relação ao canto que o laser puxa. */
const LONGE_DO_CANTO = { x: 78, y: 18 };

/** Quando a primeira letra do nome acende e o passo entre elas (iguais ao CSS). */
const PRIMEIRA_LETRA = 1200;
const PASSO_LETRA = 60;
/** Quanto cada letra leva do livro até o lugar dela. */
const VOO_LETRA = 320;

/** O card fechado em envelope, em px. */
const ENVELOPE = { w: 46, h: 30 };

/** A tabela do Triador: as linhas do card dos dados, em colunas. */
const COLUNAS = 3;
const LINHAS = 4;

/**
 * Onde cada agente surge depois do estalo, em % da tela (desktop, celular):
 * dois ao lado de cada marca, que é de onde eles saem.
 */
const POSICOES: Record<NomeFamiliar, [number, number, number, number]> = {
  mensageiro: [7, 42, 84, 15],
  escriba: [30, 42, 66, 11],
  guardiao: [63, 24, 84, 35],
  arquiteto: [88, 24, 66, 31],
  triador: [62, 57, 84, 58],
  vigia: [86, 57, 66, 62],
};

/**
 * Lugar de um fragmento: x, y e giro no desktop; x e y no celular, onde só
 * os que têm posição aparecem.
 */
type Lugar = { x: number; y: number; r: number; xm?: number; ym?: number };
const LUGARES: Lugar[] = [
  { x: 5.6, y: 8.6, r: -5, xm: 4, ym: 3 },
  { x: 32.6, y: 15.8, r: -6 },
  { x: 75.7, y: 24.2, r: 6 },
  { x: 38.9, y: 30.4, r: 5, xm: 30, ym: 22 },
  { x: 7.6, y: 45.9, r: -3 },
  { x: 36.1, y: 53.1, r: 7 },
  { x: 72.2, y: 60, r: 4 },
  { x: 4.2, y: 60.2, r: 5 },
  { x: 41.7, y: 64.2, r: -5 },
];
/** As três marcas, na ordem dos cards: cada uma do lado da vaga para onde vai. */
const LUGARES_MARCA: Lugar[] = [
  { x: 4.9, y: 27.4, r: -4, xm: 4, ym: 11 },
  { x: 61.1, y: 8.6, r: 4, xm: 16, ym: 31 },
  { x: 59.7, y: 42.7, r: -6, xm: 4, ym: 49 },
];

/** O primeiro elemento visível (com tamanho) que casa com o seletor. */
function caixa(seletor: string) {
  for (const el of document.querySelectorAll(seletor)) {
    const r = el.getBoundingClientRect();
    if (r.width > 0) return r;
  }
  return null;
}

const entre = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/** Canto onde o agente mora num card: 30 px da direita, 12 px acima. */
const cantoDoCard = (r: DOMRect): [number, number] => [r.right - 30, r.top - 12];

type Retangulo = { left: number; top: number; width: number; height: number };

export function Abertura({
  textos,
  idioma,
  cards,
}: {
  textos: Textos;
  idioma: "pt" | "en";
  /** Os três casos da primeira fileira, na ordem das vagas. */
  cards: { dominio: string; titulo: string }[];
}) {
  const cena = useRef<HTMLDivElement>(null);
  const mundo = useRef<HTMLDivElement>(null);
  const relogios = useRef<number[]>([]);
  const quadros = useRef<number[]>([]);
  const contador = useRef<HTMLSpanElement>(null);

  const depois = useCallback((ms: number, fazer: () => void) => {
    relogios.current.push(window.setTimeout(fazer, ms));
  }, []);

  const elemento = useCallback((seletor: string) => cena.current?.querySelector<HTMLElement>(seletor) ?? null, []);

  /**
   * O vento atrás do Mensageiro enquanto ele leva um card: linhas na direção
   * contrária à do voo, que somem quando ele chega.
   */
  const ventar = useCallback(
    (nome: NomeFamiliar, x: number, y: number, duracao: number) => {
      const el = elemento(`[data-voo="${nome}"]`);
      const de = el?.getBoundingClientRect();
      if (!el || !de) return;
      const angulo = Math.atan2(y - (de.top + de.height / 2), x - (de.left + de.width / 2));
      el.style.setProperty("--ang", `${angulo}rad`);
      el.setAttribute("data-vento", "");
      relogios.current.push(window.setTimeout(() => el.removeAttribute("data-vento"), duracao));
    },
    [elemento],
  );

  /** Leva um agente até um ponto da tela, em px, na escala e no tempo dados. */
  const voar = useCallback(
    (nome: NomeFamiliar, x: number, y: number, escala: number, duracao = 1100) => {
      const el = elemento(`[data-voo="${nome}"]`);
      if (!el) return;
      el.style.setProperty("--dur", `${duracao}ms`);
      el.style.left = `${entre(x, 28, innerWidth - 28)}px`;
      el.style.top = `${entre(y, 28, innerHeight + 120)}px`;
      el.style.setProperty("--s", String(escala));
    },
    [elemento],
  );

  /** Põe um card voador num retângulo da tela, no tempo e no giro dados. */
  const moverCard = useCallback(
    (i: number, r: Retangulo, duracao: number, giro = 0, escala = 1) => {
      const el = elemento(`[data-cv="${i}"]`);
      if (!el) return;
      el.style.setProperty("--dur", `${duracao}ms`);
      el.style.setProperty("--giro", `${giro}deg`);
      el.style.setProperty("--escala", String(escala));
      Object.assign(el.style, {
        left: `${r.left}px`,
        top: `${r.top}px`,
        width: `${r.width}px`,
        height: `${r.height}px`,
      });
    },
    [elemento],
  );

  /** O card voador pousa: some, e o card de verdade aparece na vaga. */
  const pousarCard = useCallback(
    (i: number) => {
      document.querySelector(`[data-vaga="${i}"]`)?.setAttribute("data-chegou", "");
      elemento(`[data-cv="${i}"]`)?.setAttribute("data-pousou", "");
    },
    [elemento],
  );

  /** Leva um card até a vaga; se ela está abaixo da dobra, ele desce para lá. */
  const levarPara = useCallback(
    (i: number, vaga: DOMRect | null, duracao: number, giro = 0) => {
      if (vaga && vaga.top < innerHeight) {
        moverCard(i, vaga, duracao, giro);
        return true;
      }
      const atual = elemento(`[data-cv="${i}"]`)?.getBoundingClientRect();
      if (atual)
        moverCard(
          i,
          {
            left: atual.left,
            top: innerHeight + 40,
            width: atual.width,
            height: atual.height,
          },
          duracao,
        );
      return false;
    },
    [elemento, moverCard],
  );

  /** Comentário ao lado da âncora se couber; senão, acima ou abaixo dela. */
  const comentar = useCallback(
    (seletor: string, ancora: DOMRect, acima = false) => {
      const el = elemento(seletor);
      if (!el) return;
      const largura = el.offsetWidth;
      const altura = el.offsetHeight;
      const cabeAoLado = ancora.right + 24 + largura < innerWidth - 12;
      const left = cabeAoLado ? ancora.right + 24 : entre(ancora.right - largura, 16, innerWidth - largura - 16);
      const top = cabeAoLado ? ancora.top : acima ? Math.max(12, ancora.top - altura - 14) : ancora.bottom + 10;
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
    },
    [elemento],
  );

  /**
   * A câmera: aproxima o mundo até a dor centrar na tela, sem mostrar a borda
   * dele. Sem alvo, recua seca para o plano geral.
   */
  const focar = useCallback((alvo: DOMRect | null) => {
    const el = mundo.current;
    if (!el) return;
    if (!alvo) {
      el.style.setProperty("--cam-dur", "0.35s");
      el.style.setProperty("--cam-curva", "cubic-bezier(0.2, 0.9, 0.25, 1)");
      el.style.transform = "";
      return;
    }
    const s = innerWidth < 640 ? 1.3 : 1.7;
    const cx = alvo.left + alvo.width / 2;
    const cy = alvo.top + alvo.height / 2;
    const tx = entre(innerWidth / 2 - cx * s, innerWidth * (1 - s), 0);
    const ty = entre(innerHeight / 2 - cy * s, innerHeight * (1 - s), 0);
    el.style.removeProperty("--cam-dur");
    el.style.removeProperty("--cam-curva");
    el.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
  }, []);

  /** O olhar: uma linha dos olhos dele até cada dor marcada. */
  const marcar = useCallback(() => {
    const ele = elemento(".cena-juliano")?.getBoundingClientRect();
    if (!ele) return;
    const olhoX = ele.left + ele.width * 0.55;
    const olhoY = ele.top + ele.height * 0.1;
    cena.current?.querySelectorAll<SVGLineElement>("[data-olhar]").forEach((linha) => {
      const alvo = elemento(`[data-marca="${linha.dataset.olhar}"] .frag-cartao`)?.getBoundingClientRect();
      if (!alvo) return;
      linha.setAttribute("x1", String(olhoX));
      linha.setAttribute("y1", String(olhoY));
      linha.setAttribute("x2", String(alvo.left + alvo.width / 2));
      linha.setAttribute("y2", String(alvo.bottom));
    });
    // Mede no plano geral, antes de a câmera sair dele.
    for (let m = 0; m < 3; m++) {
      const alvo = elemento(`[data-marca="${m}"]`)?.getBoundingClientRect() ?? null;
      depois(m * PASSO_MARCA, () => focar(alvo));
    }
  }, [depois, elemento, focar]);

  /**
   * O estalo: cada dor marcada se desdobra, no lugar dela, no card do caso
   * que a resolve — do tamanho do fragmento até o de um card.
   */
  const estalo = useCallback(() => {
    focar(null);
    const largura = Math.min(300, innerWidth * 0.62);
    const altura = Math.min(150, largura * 0.6);
    // As dores são medidas depois do recuo, já no plano geral.
    depois(360, () => {
      for (let i = 0; i < 3; i++) {
        const frag = elemento(`[data-marca="${i}"] .frag-cartao`)?.getBoundingClientRect();
        if (!frag) continue;
        moverCard(i, frag, 0);
        const cx = frag.left + frag.width / 2;
        const cy = frag.top + frag.height / 2;
        depois(60, () =>
          moverCard(
            i,
            {
              left: entre(cx - largura / 2, 12, innerWidth - largura - 12),
              top: entre(cy - altura / 2, 12, innerHeight - altura - 12),
              width: largura,
              height: altura,
            },
            650,
          ),
        );
      }
    });
  }, [depois, elemento, focar, moverCard]);

  /**
   * O Escriba passa por baixo do nome, letra por letra, e cada uma sai do
   * livro dele e voa até o seu lugar, chegando quando ela acende no CSS.
   */
  const ditar = useCallback(
    (nome: DOMRect) => {
      const palco = cena.current;
      const corpo = elemento('[data-voo="escriba"] .familiar');
      if (!palco || !corpo) return;
      const letras = [...document.querySelectorAll<HTMLElement>('[data-alvo="nome"] .letra')];
      const casa = (r: DOMRect): [number, number] => [r.left + r.width / 2, r.bottom + 30];
      const primeira = letras[0]?.getBoundingClientRect();
      if (primeira) voar("escriba", ...casa(primeira), 1.15, 900);
      letras.forEach((letra, i) => {
        const texto = letra.textContent ?? "";
        const r = letra.getBoundingClientRect();
        const quando = PRIMEIRA_LETRA + i * PASSO_LETRA - VOO_LETRA;
        depois(quando - 120, () => voar("escriba", ...casa(r), 1.15, 160));
        if (!texto.trim()) return;
        depois(quando, () => {
          const livro = corpo.getBoundingClientRect();
          const estilo = getComputedStyle(letra);
          const voa = document.createElement("span");
          voa.className = "letra-voa";
          voa.textContent = texto;
          Object.assign(voa.style, {
            left: `${r.left}px`,
            top: `${r.top}px`,
            fontFamily: estilo.fontFamily,
            fontSize: estilo.fontSize,
            lineHeight: estilo.lineHeight,
            letterSpacing: estilo.letterSpacing,
          });
          palco.append(voa);
          const dx = livro.left + livro.width / 2 - (r.left + r.width / 2);
          const dy = livro.top + livro.height * 0.3 - (r.top + r.height / 2);
          voa
            .animate(
              [
                { transform: `translate(${dx}px, ${dy}px) scale(0.25)`, opacity: 0 },
                { opacity: 1, offset: 0.25 },
                { transform: "none", opacity: 1 },
              ],
              { duration: VOO_LETRA, easing: "cubic-bezier(0.3, 0.6, 0.3, 1)", fill: "forwards" },
            )
            .finished.then(
              () => voa.remove(),
              () => voa.remove(),
            );
        });
      });
      // Escrito o nome, ele volta para o canto de onde vê a obra.
      depois(PRIMEIRA_LETRA + letras.length * PASSO_LETRA + 150, () => {
        const estreito = innerWidth < 640;
        voar("escriba", estreito ? innerWidth - 42 : nome.right + 40, estreito ? nome.bottom - 8 : nome.top - 2, 1.15, 700);
      });
    },
    [depois, elemento, voar],
  );

  /**
   * O Mensageiro fecha o card num envelope onde ele está, leva voando até a
   * vaga e ali o abre: quem pousa é o card inteiro.
   */
  const entregar = useCallback(
    (i: number, vaga: DOMRect) => {
      const el = elemento(`[data-cv="${i}"]`);
      const de = el?.getBoundingClientRect();
      if (!el || !de) return;
      el.setAttribute("data-envelope", "");
      moverCard(i, { left: de.right - ENVELOPE.w, top: de.top, width: ENVELOPE.w, height: ENVELOPE.h }, 380);
      depois(420, () => {
        const [x, y] = cantoDoCard(vaga);
        ventar("mensageiro", x, y, 1100);
        voar("mensageiro", x, y, 1.05, 1100);
        moverCard(
          i,
          { left: vaga.right - ENVELOPE.w - 8, top: vaga.top + 6, width: ENVELOPE.w, height: ENVELOPE.h },
          1100,
          -8,
        );
        depois(1150, () => {
          el.removeAttribute("data-envelope");
          moverCard(i, vaga, 450);
          depois(480, () => pousarCard(i));
        });
      });
    },
    [depois, elemento, moverCard, pousarCard, ventar, voar],
  );

  /**
   * O Triador desmonta o card dos dados em linhas embaralhadas e as separa,
   * coluna por coluna, dentro da vaga; assentada a última, o card de verdade
   * aparece no lugar da tabela.
   */
  const ordenar = useCallback(
    (vaga: DOMRect) => {
      const el = elemento('[data-cv="2"]');
      const de = el?.getBoundingClientRect();
      const palco = cena.current;
      if (!el || !de || !palco) return;
      voar("triador", de.right + 6, de.top - 14, 1.05, 1000);
      const casa = (r: Retangulo, c: number, l: number) => {
        const largura = (r.width - 44) / COLUNAS;
        return {
          left: `${r.left + 22 + c * largura}px`,
          top: `${r.top + 26 + (l * (r.height - 60)) / (LINHAS - 1)}px`,
          width: `${largura - 12}px`,
        };
      };
      const lugares = [...Array(COLUNAS * LINHAS).keys()];
      const origens = [...lugares].sort(() => Math.random() - 0.5);
      const pecas = lugares.map((d, k) => {
        const p = document.createElement("i");
        p.className = "linha-dado";
        p.dataset.col = String(d % COLUNAS);
        p.style.setProperty("--r", `${(Math.random() - 0.5) * 30}deg`);
        p.style.setProperty("--dx", `${(Math.random() - 0.5) * 40}px`);
        p.style.setProperty("--dy", `${(Math.random() - 0.5) * 30}px`);
        Object.assign(p.style, casa(de, origens[k] % COLUNAS, Math.floor(origens[k] / COLUNAS)));
        palco.append(p);
        return p;
      });
      // O card se desfaz nas linhas, que se espalham tortas.
      depois(1000, () => {
        el.setAttribute("data-pousou", "");
        pecas.forEach((p) => p.setAttribute("data-solta", ""));
      });
      depois(1500, () => {
        const [x, y] = cantoDoCard(vaga);
        voar("triador", x, y, 1.05, 1300);
        lugares.forEach((d, k) => {
          const c = d % COLUNAS;
          const l = Math.floor(d / COLUNAS);
          depois((c * LINHAS + l) * 100, () => {
            Object.assign(pecas[k].style, casa(vaga, c, l));
            pecas[k].setAttribute("data-assentou", "");
          });
        });
      });
      depois(1500 + COLUNAS * LINHAS * 100 + 650, () => {
        pousarCard(2);
        pecas.forEach((p) => p.setAttribute("data-saiu", ""));
        depois(400, () => pecas.forEach((p) => p.remove()));
      });
    },
    [depois, elemento, pousarCard, voar],
  );

  /**
   * O Arquiteto puxa a caixa do nome pelo canto inferior direito: a caixa
   * cresce do tamanho de partida até o real, e a medida conta junto.
   */
  const puxarCaixa = useCallback(
    (bloco: DOMRect) => {
      const el = elemento(".caixa-nome");
      const medida = elemento(".caixa-nome .medida");
      if (!el || !medida) return;
      const w0 = Math.round(bloco.width * 0.38);
      const h0 = Math.round(bloco.height * 0.45);
      Object.assign(el.style, {
        left: `${bloco.left}px`,
        top: `${bloco.top}px`,
        width: `${w0}px`,
        height: `${h0}px`,
      });
      medida.textContent = `${w0} × ${h0}`;
      // Ele não encosta: fica ao lado do canto e puxa com o laser. Na tela
      // estreita não há lado, então fica embaixo.
      const estreito = innerWidth < 640;
      const longe = (x: number, y: number): [number, number] =>
        estreito ? [x - 10, y + 64] : [x + LONGE_DO_CANTO.x, y + LONGE_DO_CANTO.y];
      voar("arquiteto", ...longe(bloco.left + w0, bloco.top + h0), 1.15, 900);

      const feixe = elemento(".laser-nome");
      const ponta = elemento(".laser-ponta");
      const corpo = elemento('[data-voo="arquiteto"] .familiar');
      const faiscar = faiscador();
      depois(950, () => {
        el.style.width = `${bloco.width}px`;
        el.style.height = `${bloco.height}px`;
        voar("arquiteto", ...longe(bloco.right, bloco.bottom), 1.15, PUXADA);
        feixe?.setAttribute("data-on", "");
        const inicio = performance.now();
        const contar = (agora: number) => {
          const t = Math.min((agora - inicio) / PUXADA, 1);
          // mesma curva do CSS (ease-in-out), para o número acompanhar a borda
          const k = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
          const w = w0 + (bloco.width - w0) * k;
          const h = h0 + (bloco.height - h0) * k;
          medida.textContent = `${Math.round(w)} × ${Math.round(h)}`;
          // O feixe sai do olho dele e toca o canto, onde saltam as faíscas.
          const olho = corpo?.getBoundingClientRect();
          const x = bloco.left + w;
          const y = bloco.top + h;
          if (feixe && olho) {
            feixe.setAttribute("x1", String(olho.left + olho.width * 0.5));
            feixe.setAttribute("y1", String(olho.top + olho.height * 0.28));
            feixe.setAttribute("x2", String(x));
            feixe.setAttribute("y2", String(y));
            ponta?.setAttribute("cx", String(x));
            ponta?.setAttribute("cy", String(y));
          }
          if (cena.current) faiscar(cena.current, x, y);
          if (t < 1) quadros.current.push(requestAnimationFrame(contar));
          else feixe?.removeAttribute("data-on");
        };
        quadros.current.push(requestAnimationFrame(contar));
      });
    },
    [depois, elemento, voar],
  );

  const obra = useCallback(() => {
    const hero = caixa('[data-alvo="hero"]');
    const bloco = caixa('[data-alvo="bloco-nome"]');
    const nome = caixa('[data-alvo="nome"]');
    const frase = caixa('[data-alvo="frase"]');
    if (!hero || !bloco || !nome || !frase) return;
    const vagas = [0, 1, 2].map((i) => caixa(`[data-vaga="${i}"]`));

    // A moldura tracejada é a página sendo desenhada: do hero à primeira fileira.
    // Se a fileira não cabe na tela, a moldura fica aberta embaixo e segue
    // para fora dela, em vez de cortar os cards ao meio.
    const moldura = elemento(".moldura");
    if (moldura) {
      const fundo = (vagas[0]?.bottom ?? hero.bottom) + 16;
      const aberta = fundo > innerHeight - 16;
      const base = aberta ? innerHeight - 16 : fundo;
      Object.assign(moldura.style, {
        left: `${hero.left - 16}px`,
        top: `${hero.top + 8}px`,
        width: `${hero.width + 32}px`,
        height: `${(aberta ? innerHeight + 2 : base) - hero.top - 8}px`,
        borderBottomStyle: aberta ? "none" : "",
      });
      // Ele assiste de fora da obra: na margem, à esquerda da moldura, com os
      // pés na linha de baixo. Sem margem (celular), fica dentro, no vão
      // acima da primeira fileira, onde nem a linha nem os cards o cobrem.
      const juliano = elemento(".cena-juliano");
      if (juliano) {
        const altura = entre(innerHeight * 0.1, 72, 96);
        const largura = (altura * 99) / 240;
        const margem = hero.left - 16;
        const fora = margem >= largura + 28;
        const direita = fora ? margem - 14 : margem + 8 + largura;
        juliano.style.left = `${direita - largura * (1 - 0.546)}px`;
        const chao = fora ? base : Math.min(base - 6, (vagas[0]?.top ?? base) - 64);
        juliano.style.bottom = `${innerHeight - chao}px`;
      }
    }

    puxarCaixa(bloco);
    ditar(nome);
    // Na tela estreita não há margem: quem esperaria ao lado do texto espera
    // na borda direita, sem cobrir o começo das linhas.
    const estreito = innerWidth < 640;
    voar(
      "guardiao",
      estreito ? innerWidth - 42 : bloco.left - 48,
      frase.top + frase.height / 2 + (estreito ? 40 : 0),
      1.15,
    );
    voar("vigia", hero.right - 18, hero.top + (estreito ? 16 : 44), 1.15);

    // O Mensageiro busca o primeiro card onde ele nasceu e o leva à vaga.
    const c0 = elemento('[data-cv="0"]')?.getBoundingClientRect();
    if (c0) voar("mensageiro", c0.right - 24, c0.top - 12, 1.05, 900);
    // Se a vaga está abaixo da dobra (celular), ele leva o envelope para lá.
    depois(1000, () => {
      const v0 = vagas[0];
      if (v0) entregar(0, v0);
      else levarPara(0, v0, 1100);
    });

    // O segundo espera na borda direita até o Mensageiro voltar para ele na
    // revisão: encolhido ao lado do nome ou, no celular, já fechado no
    // envelope, que cabe ali sem cobrir nada.
    const c1 = elemento('[data-cv="1"]')?.getBoundingClientRect();
    if (c1 && vagas[1] && vagas[1].top < innerHeight) {
      // Encolhe pelo canto de cima à direita: a borda direita fica onde está.
      const r = {
        left: innerWidth - c1.width - 16,
        top: innerHeight * 0.3,
        width: c1.width,
        height: c1.height,
      };
      moverCard(1, r, 1000, 4, 0.6);
    } else if (c1) {
      elemento('[data-cv="1"]')?.setAttribute("data-envelope", "");
      moverCard(
        1,
        { left: innerWidth - ENVELOPE.w - 18, top: innerHeight * 0.56, width: ENVELOPE.w, height: ENVELOPE.h },
        900,
        6,
      );
    }

    // O Triador desmonta o terceiro e o remonta na vaga que acende; se a
    // vaga está abaixo da dobra, as linhas descem para lá já em colunas.
    const v2 = vagas[2];
    if (v2) ordenar(v2);
    else {
      voar("triador", innerWidth / 2, bloco.bottom + 44, 1.05);
      levarPara(2, v2, 1000);
    }
  }, [depois, ditar, elemento, entregar, levarPara, moverCard, ordenar, puxarCaixa, voar]);

  const revisao = useCallback(() => {
    const frase = caixa('[data-alvo="frase"]');
    if (frase) comentar('[data-c="guardiao"]', frase);

    // Segunda viagem do Mensageiro: o card de contratos, que esperava na borda.
    const c1 = elemento('[data-cv="1"]')?.getBoundingClientRect();
    if (c1) voar("mensageiro", c1.left + 20, c1.top - 12, 1.05, 500);
    depois(550, () => {
      const v1 = caixa('[data-vaga="1"]');
      if (v1) entregar(1, v1);
      else levarPara(1, v1, 1100);
    });
  }, [comentar, depois, elemento, entregar, levarPara, voar]);

  const prova = useCallback(() => {
    const v2 = caixa('[data-vaga="2"]');
    if (!v2) return;
    // Com o card abaixo da dobra (celular), o Vigia aponta de baixo da tela,
    // para onde as linhas desceram.
    if (v2.top >= innerHeight - 40) {
      elemento(".pino")?.style.setProperty("left", "-40px");
      comentar('[data-c="vigia"]', new DOMRect(16, innerHeight - 70, innerWidth - 32, 1), true);
      return;
    }
    const pino = elemento(".pino");
    if (pino) {
      pino.style.left = `${v2.right - 14}px`;
      pino.style.top = `${v2.top + 14}px`;
    }
    const varredura = elemento(".varredura");
    if (varredura)
      Object.assign(varredura.style, {
        left: `${v2.left}px`,
        top: `${v2.top}px`,
        width: `${v2.width}px`,
        height: `${Math.min(v2.height, innerHeight - v2.top)}px`,
      });
    comentar('[data-c="vigia"]', v2, true);
  }, [comentar, elemento]);

  const fim = useCallback(() => {
    for (const nome of FAMILIARES) {
      const pouso = caixa(`[data-pouso="${nome}"]`);
      if (pouso && pouso.top < innerHeight) {
        voar(nome, pouso.left + pouso.width / 2, pouso.top + pouso.height / 2, pouso.width / 48);
      } else {
        // Quem mora abaixo da dobra desce para lá.
        const el = elemento(`[data-voo="${nome}"]`);
        voar(nome, parseFloat(el?.style.left ?? "") || innerWidth / 2, innerHeight + 90, 1);
      }
    }
  }, [elemento, voar]);

  const parar = useCallback(() => {
    relogios.current.forEach(clearTimeout);
    relogios.current = [];
    quadros.current.forEach(cancelAnimationFrame);
    quadros.current = [];
  }, []);

  /** Devolve cada peça ao seu lugar de cena, para um "ver de novo". */
  const limpar = useCallback(() => {
    cena.current?.querySelectorAll<HTMLElement>("[data-voo], [data-cv]").forEach((el) => {
      for (const p of ["left", "top", "width", "height", "--s", "--dur", "--giro", "--escala", "--ang"])
        el.style.removeProperty(p);
      el.removeAttribute("data-pousou");
      el.removeAttribute("data-envelope");
      el.removeAttribute("data-vento");
    });
    elemento(".laser-nome")?.removeAttribute("data-on");
    cena.current?.querySelectorAll(".faisca-voa, .letra-voa, .linha-dado").forEach((f) => f.remove());
    document.querySelectorAll("[data-chegou]").forEach((el) => el.removeAttribute("data-chegou"));
    mundo.current?.removeAttribute("style");
    for (const p of ["left", "bottom"]) elemento(".cena-juliano")?.style.removeProperty(p);
  }, [elemento]);

  const finalizar = useCallback(() => {
    parar();
    const html = document.documentElement;
    html.classList.remove("abertura", ...ETAPAS.map(([classe]) => classe));
    limpar();
  }, [limpar, parar]);

  const iniciar = useCallback(() => {
    parar();
    limpar();
    const html = document.documentElement;
    html.classList.remove(...ETAPAS.map(([classe]) => classe));
    window.scrollTo({ top: 0, behavior: "instant" });
    html.classList.add("abertura");
    try {
      sessionStorage.setItem("abertura-vista", "1");
    } catch {
      // Sem storage, a abertura só toca de novo na próxima visita.
    }

    // O contador sobe enquanto ninguém faz nada, e para junto com o tempo.
    const formato = new Intl.NumberFormat(idioma === "pt" ? "pt-BR" : "en-US");
    let pendencias = 2917;
    if (contador.current) contador.current.textContent = formato.format(pendencias);
    const subir = window.setInterval(() => {
      pendencias += 1 + Math.floor(Math.random() * 3);
      if (contador.current) contador.current.textContent = formato.format(Math.min(pendencias, 2950));
    }, 50);
    depois(ETAPAS[0][1], () => clearInterval(subir));
    // No estalo, sobram só as três perguntas que ganham resposta agora.
    depois(ETAPAS[2][1] + 300, () => {
      if (contador.current) contador.current.textContent = "3";
    });

    const aoEntrar: Partial<Record<(typeof ETAPAS)[number][0], () => void>> = {
      "e-marca": marcar,
      "e-estalo": estalo,
      "e-obra": obra,
      "e-revisao": revisao,
      "e-prova": prova,
      "e-fim": fim,
    };
    for (const [classe, quando] of ETAPAS) {
      depois(quando, () => {
        html.classList.add(classe);
        aoEntrar[classe]?.();
      });
    }
    depois(DURACAO, finalizar);
  }, [depois, estalo, fim, finalizar, idioma, limpar, marcar, obra, parar, prova, revisao]);

  useEffect(() => {
    const html = document.documentElement;
    const seguranca = (window as { __aberturaSeguranca?: number }).__aberturaSeguranca;
    if (seguranca) clearTimeout(seguranca);
    if (html.classList.contains("abertura")) iniciar();

    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape" && html.classList.contains("abertura")) finalizar();
    };
    window.addEventListener("keydown", tecla);
    window.addEventListener("abertura:tocar", iniciar);
    return () => {
      window.removeEventListener("keydown", tecla);
      window.removeEventListener("abertura:tocar", iniciar);
      finalizar();
    };
  }, [finalizar, iniciar]);

  return (
    <div ref={cena} className="cena" aria-hidden>
      {/* o mundo: o que a câmera aproxima; o contador e o time ficam fora */}
      <div ref={mundo} className="cena-mundo">
        {/* ------------------------------------------------------ o caos */}
        {textos.fragmentos.slice(0, LUGARES.length).map((texto, i) => (
          <Fragmento key={i} lugar={LUGARES[i]} ordem={i}>
            {texto}
          </Fragmento>
        ))}
        {textos.marcas.map((texto, m) => (
          <Fragmento
            key={`m${m}`}
            lugar={LUGARES_MARCA[m]}
            ordem={[2, 0, 5][m]}
            marca={m}
            rotulo={textos.rotuloGargalo}
          >
            {texto}
          </Fragmento>
        ))}

        {/* poeira: anda com o caos e congela com o tempo */}
        {Array.from({ length: 10 }, (_, k) => (
          <span key={k} className="poeira" style={{ "--k": k } as React.CSSProperties} />
        ))}

        {/* --------------------------------------------------- o olhar */}
        <svg className="olhares">
          {[0, 1, 2].map((m) => (
            <line key={m} data-olhar={m} style={{ "--m": m } as React.CSSProperties} />
          ))}
        </svg>

        {/* ------------------------------------------------------ ele */}
        <div className="cena-juliano">
          <span className="onda-tempo" />
          {[0, 1, 2, 3].map((n) => (
            <span key={n} className="onda" style={{ "--n": n } as React.CSSProperties} />
          ))}
        </div>
      </div>

      <div className="pendencias">
        <span className="pendencias-estado">
          <span className="subindo">▲▲</span>
          <span className="congelado">‖ {textos.parado}</span>
        </span>
        <span className="pendencias-numero" ref={contador}>
          {new Intl.NumberFormat(idioma === "pt" ? "pt-BR" : "en-US").format(2917)}
        </span>
        <span className="pendencias-rotulo">{textos.rotuloPendencias}</span>
      </div>

      {/* --------------------------- as respostas: os cards que voam */}
      {cards.slice(0, 3).map((c, i) => (
        <div key={c.titulo} data-cv={i} className="cartao-voo">
          <p className="cartao-voo-dominio">{c.dominio}</p>
          <p className="cartao-voo-titulo">{c.titulo}</p>
        </div>
      ))}

      {/* --------------------------------------- a obra sobre a página */}
      <div className="moldura" />
      <div className="caixa-nome">
        <i className="alca alca-ne" />
        <i className="alca alca-no" />
        <i className="alca alca-se" />
        <i className="alca alca-so" />
        <span className="medida" />
      </div>
      <svg className="lasers">
        <line className="laser-nome" />
        <circle className="laser-ponta" r="3.5" />
      </svg>
      <div className="varredura" />

      {/* ------------------------------------------------- o time */}
      {FAMILIARES.map((nome, n) => {
        const [px, py, pxm, pym] = POSICOES[nome];
        return (
          <div
            key={nome}
            data-voo={nome}
            className="cena-familiar"
            style={
              {
                "--px": px,
                "--py": py,
                "--pxm": pxm,
                "--pym": pym,
                "--n": n,
              } as React.CSSProperties
            }
          >
            <span className="faisca" />
            <Familiar nome={nome} />
            <span className="etiqueta">{textos.familiares[nome]}</span>
          </div>
        );
      })}

      <div className="comentario" data-c="guardiao">
        <span className="autor">{textos.familiares.guardiao}</span>
        <p>{textos.comentarioGuardiao}</p>
      </div>
      <span className="pino" />
      <div className="comentario" data-c="vigia">
        <span className="autor">{textos.familiares.vigia}</span>
        <p>{textos.comentarioVigia}</p>
        <div className="resposta">
          <span className="autor">{textos.familiares.triador}</span>
          <p>
            {textos.respostaTriador} <span className="resolvido">{textos.resolvido} ✓</span>
          </p>
        </div>
      </div>

      <button type="button" className="pular" onClick={finalizar}>
        {textos.pular} · esc
      </button>
    </div>
  );
}

/** Um pedaço do caos. Com `marca`, é uma das três dores que ele marca. */
function Fragmento({
  lugar,
  ordem,
  marca,
  rotulo,
  children,
}: {
  lugar: Lugar;
  ordem: number;
  marca?: number;
  rotulo?: string;
  children: React.ReactNode;
}) {
  const estilo = {
    "--x": lugar.x,
    "--y": lugar.y,
    "--r": lugar.r,
    "--xm": lugar.xm ?? 0,
    "--ym": lugar.ym ?? 0,
    "--i": ordem,
    "--m": marca ?? 0,
  } as React.CSSProperties;
  return (
    <div className="frag" style={estilo} data-marca={marca} data-movel={lugar.xm === undefined ? "nao" : undefined}>
      <div className="frag-cartao">
        {marca !== undefined && (
          <span className="frag-mira">
            <span className="frag-mira-numero">{marca + 1}</span>
          </span>
        )}
        <span className="frag-icone" />
        <span className="frag-texto">{children}</span>
      </div>
      {marca !== undefined && <span className="rotulo-gargalo">{rotulo}</span>}
    </div>
  );
}
