"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import { Familiar } from "@/components/abertura/Familiar";
import { faiscador } from "@/components/faiscas";
import type { Cenas, EventoNo, Idioma, NomeFamiliar, Prancha } from "@/conteudo/tipos";
import { movimentoReduzido, useAoChegar } from "./Anfitriao";
import { EVENTO_IR } from "./Deslize";
import { PREFIXO_SISTEMA } from "./endereco";
import { ALTURA, CHAVE, LARGURA, NO, PLANTAS, tracado } from "./plantas";

/**
 * Cena 2. Os sistemas em pranchas de arquitetura, num carrossel. A do centro
 * roda sozinha: um pacote percorre o grafo de verdade do sistema. "Ver
 * detalhes" abre o cartão, onde o visitante escolhe um cenário e vê cada nó
 * executar, com o rastro embaixo.
 *
 * Um familiar acompanha a cena. Na chegada, o Arquiteto desenha a primeira
 * prancha nó por nó; depois, ao lado de cada prancha, fica o dono da decisão
 * central daquele sistema, de olho no nó da regra dele: quando o pacote passa
 * ali, ele lança o olhar até o nó e reage. Durante uma execução, ele voa até o nó e vira o
 * familiar cuja regra entra em jogo ali. O balão procura o lado em que não
 * cobre texto nem nó; na tela estreita, a fala desce para uma doca no fluxo.
 */

const ROMANOS = ["I", "II", "III", "IV", "V", "VI"];
const VIAGEM = 520;
const PAUSA = 380;
const PAUSA_FALA = 1700;
const TROCA = 200;
/** Lado do familiar, em px, fora da tela estreita. */
const TAM = 56;
/** Quantos feixes ele usa ao mesmo tempo na montagem. */
const FEIXES = 3;
const ESTREITA = "(max-width: 639px)";

/* A conta das milhas: a mesma da versão simplificada da bancada. */
const PRECO = 1800;
const MILHARES = 60;
const TAXAS = 80;

type Vez = { parou: boolean };
type Ponto = { x: number; y: number };

/** De 0 a 1 em `ms`, um passo por quadro; para junto com a vez. */
function animar(ms: number, vez: Vez, passo: (t: number) => void) {
  return new Promise<void>((ok) => {
    const t0 = performance.now();
    const quadro = (agora: number) => {
      const t = Math.min(1, (agora - t0) / ms);
      passo(t);
      if (t < 1 && !vez.parou) requestAnimationFrame(quadro);
      else ok();
    };
    requestAnimationFrame(quadro);
  });
}

/** O ponto a `l` do canto de cima à esquerda do nó, no sentido do traço do SVG. */
function noContorno(x: number, y: number, l: number): Ponto {
  const w = NO.largura;
  const h = NO.altura;
  const x0 = x - w / 2;
  const y0 = y - h / 2;
  if (l < w) return { x: x0 + l, y: y0 };
  if (l < w + h) return { x: x0 + w, y: y0 + l - w };
  if (l < 2 * w + h) return { x: x0 + w - (l - w - h), y: y0 + h };
  return { x: x0, y: y0 + h - (l - 2 * w - h) };
}

/**
 * O contorno do nó nasce na ponta: a cada quadro o traço cresce até onde
 * ela está, e a medida conta junto, como a caixa do nome na abertura.
 */
async function tracarNo(g: SVGGElement, ms: number, vez: Vez, ponta: (p: Ponto) => void) {
  const rect = g.querySelector("rect");
  if (!rect) return;
  const x = Number(g.dataset.x);
  const y = Number(g.dataset.y);
  const P = 2 * (NO.largura + NO.altura);
  const medida = document.createElementNS("http://www.w3.org/2000/svg", "text");
  medida.setAttribute("class", "pr-medida");
  medida.setAttribute("x", String(x + NO.largura / 2));
  medida.setAttribute("y", String(y - NO.altura / 2 - 6));
  g.ownerSVGElement?.appendChild(medida);
  rect.style.strokeDasharray = `${P}`;
  rect.style.fillOpacity = "0";
  g.classList.add("posto");
  await animar(ms, vez, (t) => {
    const l = P * t;
    rect.style.strokeDashoffset = `${P - l}`;
    medida.textContent = `${Math.round(Math.min(l, NO.largura))} × ${Math.round(Math.max(0, Math.min(l - NO.largura, NO.altura)))}`;
    ponta(noContorno(x, y, Math.min(l, P - 0.01)));
  });
  medida.remove();
  rect.style.removeProperty("stroke-dasharray");
  rect.style.removeProperty("stroke-dashoffset");
  rect.style.transition = "fill-opacity 0.3s";
  rect.style.fillOpacity = "1";
  g.classList.add("fechado");
}

/** A aresta sai atrás da ponta, do nó de origem ao de destino. */
async function tracarAresta(a: SVGPathElement, ms: number, vez: Vez, ponta: (p: Ponto) => void) {
  const L = a.getTotalLength();
  a.style.strokeDasharray = `${L}`;
  a.style.strokeDashoffset = `${L}`;
  a.classList.add("posto");
  await animar(ms, vez, (t) => {
    a.style.strokeDashoffset = `${L * (1 - t)}`;
    const p = a.getPointAtLength(L * t);
    ponta({ x: p.x, y: p.y });
  });
  a.style.removeProperty("stroke-dasharray");
  a.style.removeProperty("stroke-dashoffset");
}
type Linha = { k: string; t: string; tipo?: "cliente" | "mal" | "resposta" };
type Fala = { nome: NomeFamiliar; texto: string };
type Caixa = { x: number; y: number; w: number; h: number };

const espera = (ms: number) => new Promise<void>((ok) => setTimeout(ok, ms));

/* ------------------------------------------------------------ o motor */

function limpar(svg: SVGSVGElement | null) {
  if (!svg) return;
  svg.querySelectorAll(".pr-no").forEach((g) => g.classList.remove("on", "agora", "mal"));
  svg.querySelectorAll(".pr-ar").forEach((a) => a.classList.remove("on"));
  svg.querySelectorAll(".pr-pacote").forEach((c) => c.remove());
}

function viajar(svg: SVGSVGElement, de: string, para: string, vez: Vez) {
  const a = svg.querySelector<SVGPathElement>(`.pr-ar[data-de="${de}"][data-para="${para}"]`);
  if (!a) return Promise.resolve();
  a.classList.add("on");
  const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c.setAttribute("r", "5");
  c.setAttribute("class", "pr-pacote");
  svg.appendChild(c);
  const L = a.getTotalLength();
  const t0 = performance.now();
  return new Promise<void>((ok) => {
    function quadro(t: number) {
      if (vez.parou) {
        c.remove();
        return ok();
      }
      const k = Math.min(1, (t - t0) / VIAGEM);
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      const p = a!.getPointAtLength(e * L);
      c.setAttribute("cx", String(p.x));
      c.setAttribute("cy", String(p.y));
      if (k < 1) return void requestAnimationFrame(quadro);
      c.remove();
      ok();
    }
    requestAnimationFrame(quadro);
  });
}

async function rodar(
  svg: SVGSVGElement,
  caminho: string[],
  eventos: Record<string, EventoNo>,
  vez: Vez,
  aoNo?: (id: string, ev: EventoNo, g: SVGGElement) => void,
) {
  const rapido = movimentoReduzido();
  limpar(svg);
  const visitas: Record<string, number> = {};
  for (let i = 0; i < caminho.length; i++) {
    if (vez.parou) return;
    const id = caminho[i];
    const n = (visitas[id] = (visitas[id] ?? 0) + 1);
    const ev = eventos[n > 1 ? `${id}#${n}` : id] ?? {};
    if (i && !rapido) await viajar(svg, caminho[i - 1], id, vez);
    if (vez.parou) return;
    svg.querySelectorAll(".pr-no.agora").forEach((g) => g.classList.remove("agora"));
    const g = svg.querySelector<SVGGElement>(`.pr-no[data-id="${id}"]`);
    if (!g) continue;
    g.classList.add("on", ev.mal ? "mal" : "agora");
    aoNo?.(id, ev, g);
    await espera(rapido ? 0 : ev.fala ? PAUSA_FALA : PAUSA);
  }
  svg.querySelectorAll(".pr-no.agora").forEach((g) => g.classList.remove("agora"));
}

/** Taxa mensal de um financiamento com parcela fixa (Newton). */
function taxaMensal(financiado: number, prazo: number, parcela: number) {
  let i = 0.02;
  for (let k = 0; k < 50; k++) {
    const f = (1 - (1 + i) ** -prazo) / i;
    const df = (prazo * (1 + i) ** (-prazo - 1) * i - (1 - (1 + i) ** -prazo)) / (i * i);
    i -= (f - financiado / parcela) / df;
  }
  return i;
}

/** `~~assim~~` vira texto riscado: o que o guard barrou. */
function comRisco(t: string) {
  return t.split(/~~(.*?)~~/).map((parte, i) => (i % 2 ? <s key={i}>{parte}</s> : parte));
}

/* ------------------------------------------------------------ o desenho */

function Desenho({
  prancha,
  mini,
  svgRef,
}: {
  prancha: Prancha;
  mini?: boolean;
  svgRef?: (svg: SVGSVGElement | null) => void;
}) {
  const marca = `pr${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const planta = PLANTAS[prancha.id];
  return (
    <svg ref={svgRef} className={`pr-dg ${mini ? "pr-mini" : ""}`} viewBox={`0 0 ${LARGURA} ${ALTURA}`} aria-hidden>
      <defs>
        <marker id={marca} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L8,4 L0,8" className="pr-ponta" />
        </marker>
      </defs>
      {planta.arestas.map((a) => (
        <path
          key={`${a[0]}-${a[1]}`}
          className={`pr-ar ${a[2] ? "c" : ""}`}
          data-de={a[0]}
          data-para={a[1]}
          d={tracado(planta, a)}
          markerEnd={`url(#${marca})`}
        />
      ))}
      {planta.nos.map(([id, x, y]) => {
        const { rotulo, sub } = prancha.nos[id];
        const comSub = sub && !mini;
        return (
          <g key={id} className="pr-no" data-id={id} data-x={x} data-y={y}>
            <rect x={x - NO.largura / 2} y={y - NO.altura / 2} width={NO.largura} height={NO.altura} rx="3" />
            <text x={x} y={comSub ? y - 6 : y}>
              {rotulo}
            </text>
            {comSub && (
              <text className="sub" x={x} y={y + 9}>
                {sub}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------ a cena */

export function Pranchas({
  textos,
  nomes,
  regras,
  idioma,
}: {
  textos: Cenas["pranchas"];
  nomes: Record<NomeFamiliar, string>;
  regras: Record<NomeFamiliar, string>;
  idioma: Idioma;
}) {
  const itens = textos.itens;
  const [atual, setAtual] = useState(0);
  const [aberto, setAberto] = useState(false);
  const [estreita, setEstreita] = useState(false);
  const [fala, setFala] = useState<Fala>({ nome: "arquiteto", texto: "" });
  const [trocando, setTrocando] = useState(false);
  const [rastro, setRastro] = useState<Linha[]>([]);
  const [cenario, setCenario] = useState(-1);
  const [milheiro, setMilheiro] = useState(22);
  const [porTras, setPorTras] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const famRef = useRef<HTMLDivElement>(null);
  const balaoRef = useRef<HTMLDivElement>(null);
  const cartaoRef = useRef<HTMLElement>(null);
  const rastroRef = useRef<HTMLDivElement>(null);
  const minis = useRef<(SVGSVGElement | null)[]>([]);
  const svgCartao = useRef<SVGSVGElement | null>(null);
  const vezMini = useRef<Vez>({ parou: true });
  const vezCartao = useRef<Vez>({ parou: true });
  const vezMontagem = useRef<Vez>({ parou: true });
  const montada = useRef(false);
  const [pronta, setPronta] = useState(false);
  const visivel = useRef(false);
  const abertoRef = useRef(false);
  const noAlvo = useRef<SVGGElement | null>(null);
  const nomeAtual = useRef<NomeFamiliar>("arquiteto");

  const p = itens[atual];

  useEffect(() => {
    const m = matchMedia(ESTREITA);
    const ver = () => setEstreita(m.matches);
    ver();
    m.addEventListener("change", ver);
    return () => m.removeEventListener("change", ver);
  }, []);

  /* ---------------------------------------------- o familiar e o balão */

  /** Troca a fala; se for outro familiar, ele se desfaz e volta com um estalo. */
  const virar = useCallback((nome: NomeFamiliar, texto: string) => {
    if (nomeAtual.current === nome) return setFala({ nome, texto });
    nomeAtual.current = nome;
    setTrocando(true);
    setTimeout(() => {
      setFala({ nome, texto });
      setTrocando(false);
      const f = famRef.current;
      if (!f) return;
      f.classList.remove("estalo");
      void f.offsetWidth;
      f.classList.add("estalo");
    }, TROCA);
  }, []);

  /** Escolhe o lado do balão que menos cobre o que importa. */
  const posicionarBalao = useCallback(() => {
    const f = famRef.current;
    const b = balaoRef.current;
    const r = raiz.current;
    if (!f || !b || !r || matchMedia(ESTREITA).matches) return;
    const base = r.getBoundingClientRect();
    const fx = parseFloat(f.style.left) || 0;
    const fy = parseFloat(f.style.top) || 0;
    const bw = b.offsetWidth;
    const bh = b.offsetHeight;
    const escopo = abertoRef.current && cartaoRef.current ? cartaoRef.current : r;
    const obstaculos: Caixa[] = [];
    escopo.querySelectorAll<Element>("[data-obstaculo], .pr-no").forEach((el) => {
      if (!abertoRef.current && el.closest(".pr-cartao")) return;
      if (!abertoRef.current && el.closest(".pr-prancha:not([data-pos='0'])")) return;
      const q = el.getBoundingClientRect();
      if (q.width && q.height) obstaculos.push({ x: q.left - base.left, y: q.top - base.top, w: q.width, h: q.height });
    });
    const limite = escopo.getBoundingClientRect();
    const L = { x: limite.left - base.left, y: limite.top - base.top, w: limite.width, h: limite.height };
    const lados: [string, number, number][] = [
      ["cima-esq", TAM / 2 + 18 - bw, -bh - 12],
      ["cima-dir", TAM / 2 - 18, -bh - 12],
      ["dir", TAM + 12, TAM / 2 - bh / 2],
      ["esq", -bw - 12, TAM / 2 - bh / 2],
      ["baixo-esq", TAM / 2 + 18 - bw, TAM + 24],
      ["baixo-dir", TAM / 2 - 18, TAM + 24],
    ];
    let melhor = lados[0];
    let menor = Infinity;
    for (const lado of lados) {
      const c = { x: fx + lado[1], y: fy + lado[2], w: bw, h: bh };
      let custo = 0;
      for (const o of obstaculos) {
        const ix = Math.max(0, Math.min(c.x + c.w, o.x + o.w) - Math.max(c.x, o.x));
        const iy = Math.max(0, Math.min(c.y + c.h, o.y + o.h) - Math.max(c.y, o.y));
        custo += ix * iy;
      }
      const fora =
        Math.max(0, L.x - c.x) + Math.max(0, c.x + c.w - (L.x + L.w)) + Math.max(0, L.y - c.y) + Math.max(0, c.y + c.h - (L.y + L.h));
      custo += fora * 400;
      if (custo < menor - 1) {
        menor = custo;
        melhor = lado;
      }
    }
    b.style.left = `${melhor[1]}px`;
    b.style.top = `${melhor[2]}px`;
    b.dataset.lado = melhor[0];
  }, []);

  const pousar = useCallback(
    (x: number, y: number) => {
      const f = famRef.current;
      const r = raiz.current;
      if (!f || !r) return;
      f.style.left = `${Math.max(4, Math.min(r.clientWidth - TAM - 4, x))}px`;
      f.style.top = `${Math.max(4, y)}px`;
      f.dataset.visto = "";
      requestAnimationFrame(posicionarBalao);
    },
    [posicionarBalao],
  );

  /** Ao lado da prancha do centro. */
  const pousarNoPalco = useCallback(() => {
    noAlvo.current = null;
    const r = raiz.current;
    const centro = minis.current[atual]?.closest(".pr-folha");
    if (!r || !centro) return;
    const base = r.getBoundingClientRect();
    const q = centro.getBoundingClientRect();
    pousar(q.right - base.left + 16, q.top - base.top + q.height * 0.35);
  }, [atual, pousar]);

  /** No vão entre as colunas, ao lado do nó, sem cobri-lo. */
  const pousarNoNo = useCallback(
    (g: SVGGElement) => {
      noAlvo.current = g;
      const r = raiz.current;
      const svg = g.ownerSVGElement;
      if (!r || !svg) return;
      const base = r.getBoundingClientRect();
      const q = svg.getBoundingClientRect();
      const k = q.width / LARGURA;
      const x = q.left - base.left + Number(g.dataset.x) * k;
      const y = q.top - base.top + Number(g.dataset.y) * k;
      const direita = Number(g.dataset.x) < 400;
      pousar(direita ? x + (NO.largura / 2) * k + 6 : x - (NO.largura / 2) * k - TAM - 6, y - TAM / 2);
    },
    [pousar],
  );

  useLayoutEffect(() => {
    posicionarBalao();
  }, [fala, posicionarBalao]);

  /**
   * O dono olha para o nó da regra dele: um feixe sai do olho até o nó, o nó
   * acende e ele dá um tranco. Na primeira vez em cada prancha, ele comenta.
   */
  const reagir = useCallback(
    (g: SVGGElement, comentario?: string) => {
      const r = raiz.current;
      const f = famRef.current;
      const svg = g.ownerSVGElement;
      if (!r || !f || !svg || matchMedia(ESTREITA).matches) return;
      const base = r.getBoundingClientRect();
      const q = svg.getBoundingClientRect();
      const k = q.width / LARGURA;
      const nx = q.left - base.left + Number(g.dataset.x) * k;
      const ny = q.top - base.top + Number(g.dataset.y) * k;
      const fx = (parseFloat(f.style.left) || 0) + TAM / 2;
      const fy = (parseFloat(f.style.top) || 0) + TAM / 2;
      const feixe = document.createElement("span");
      feixe.className = "pr-olhar";
      feixe.style.left = `${fx}px`;
      feixe.style.top = `${fy}px`;
      feixe.style.width = `${Math.hypot(nx - fx, ny - fy)}px`;
      feixe.style.rotate = `${Math.atan2(ny - fy, nx - fx)}rad`;
      r.appendChild(feixe);
      setTimeout(() => feixe.remove(), 1000);
      g.classList.add("vistoria");
      setTimeout(() => g.classList.remove("vistoria"), 1000);
      f.classList.remove("reage");
      void f.offsetWidth;
      f.classList.add("reage");
      if (comentario) {
        const { dono, fala: depois } = itens[atual];
        virar(dono, comentario);
        setTimeout(() => {
          if (!abertoRef.current && nomeAtual.current === dono) virar(dono, depois);
        }, 2600);
      }
    },
    [atual, itens, virar],
  );

  /* ---------------------------------------------- carrossel */

  const ir = useCallback(
    (n: number) => {
      vezMontagem.current.parou = true;
      setAtual((n + itens.length) % itens.length);
      setPorTras(false);
    },
    [itens.length],
  );

  // O dono de cada prancha assume ao lado dela, quando o giro termina.
  useEffect(() => {
    if (!montada.current || abertoRef.current) return;
    virar(itens[atual].dono, itens[atual].fala);
    const t = setTimeout(pousarNoPalco, movimentoReduzido() ? 0 : 720);
    return () => clearTimeout(t);
  }, [atual, itens, pousarNoPalco, virar]);

  // A prancha do centro roda sozinha, em laço, enquanto a cena está na tela.
  useEffect(() => {
    if (!pronta || aberto || movimentoReduzido()) return;
    const svg = minis.current[atual];
    if (!svg) return;
    const vez: Vez = { parou: false };
    vezMini.current = vez;
    const caminhos = itens[atual].cenarios.length
      ? itens[atual].cenarios.map((c) => c.caminho)
      : [
          ["entrada", "calc", "milhas"],
          ["entrada", "calc", "din"],
        ];
    const chave = CHAVE[itens[atual].id];
    let primeira = true;
    (async () => {
      await espera(600);
      for (let k = 0; !vez.parou; k++) {
        if (visivel.current)
          await rodar(svg, caminhos[k % caminhos.length], {}, vez, (id, _ev, g) => {
            if (id !== chave || abertoRef.current) return;
            reagir(g, primeira ? itens[atual].reacao : undefined);
            primeira = false;
          });
        await espera(900);
      }
      limpar(svg);
    })();
    return () => {
      vez.parou = true;
      limpar(svg);
    };
  }, [atual, aberto, itens, pronta, reagir]);

  /* ---------------------------------------------- a chegada: o Arquiteto monta */

  const montar = useCallback(async () => {
    if (montada.current) return;
    const svg = minis.current[atual];
    const terminar = () => {
      montada.current = true;
      if (famRef.current) famRef.current.style.transitionDuration = "";
      try {
        sessionStorage.setItem("montada-pranchas", "1");
      } catch {}
      svg?.classList.remove("montando");
      svg?.querySelectorAll(".posto, .fechado").forEach((el) => el.classList.remove("posto", "fechado"));
      svg?.querySelectorAll(".pr-medida, .pr-laser, .pr-faisca").forEach((el) => el.remove());
      svg?.querySelectorAll<SVGElement>(".pr-no rect, .pr-ar").forEach((el) => {
        for (const p of ["stroke-dasharray", "stroke-dashoffset", "fill-opacity", "transition"]) el.style.removeProperty(p);
      });
      if (famRef.current) famRef.current.style.transition = "";
      setPronta(true);
      if (!abertoRef.current) {
        virar(itens[atual].dono, itens[atual].fala);
        setTimeout(pousarNoPalco, 260);
      }
    };
    let vista = false;
    try {
      vista = Boolean(sessionStorage.getItem("montada-pranchas"));
    } catch {}
    if (!svg || vista || movimentoReduzido() || matchMedia(ESTREITA).matches) return terminar();
    const vez: Vez = { parou: false };
    vezMontagem.current = vez;
    svg.classList.add("montando");
    // Ele avisa ao lado da folha em branco e desenha em silêncio: o balão não
    // cobre a prancha enquanto ela nasce.
    const fam = famRef.current;
    virar("arquiteto", textos.montando);
    pousarNoPalco();
    await espera(900);
    if (vez.parou) return terminar();
    virar("arquiteto", "");
    const r = raiz.current;
    if (!fam || !r) return terminar();

    // Da planta (viewBox) para a cena, onde o familiar anda.
    const naCena = (p: Ponto) => {
      const base = r.getBoundingClientRect();
      const q = svg.getBoundingClientRect();
      const k = q.width / LARGURA;
      return { x: q.left - base.left + p.x * k, y: q.top - base.top + p.y * k, k, base, q };
    };

    // Ele fica ao lado da folha e vários feixes saem do olho dele, cada um
    // desenhando um nó: mais detalhe no mesmo tempo.
    const NS = "http://www.w3.org/2000/svg";
    const feixe = () => {
      const linha = document.createElementNS(NS, "line");
      const faisca = document.createElementNS(NS, "circle");
      linha.setAttribute("class", "pr-laser");
      faisca.setAttribute("class", "pr-faisca");
      faisca.setAttribute("r", "3.5");
      svg.append(linha, faisca);
      const faiscar = faiscador();
      const ponta = (p: Ponto) => {
        const c = naCena(p);
        faiscar(r, c.x, c.y);
        const f = fam.getBoundingClientRect();
        linha.setAttribute("x1", String((f.left + f.width * 0.5 - c.q.left) / c.k));
        linha.setAttribute("y1", String((f.top + f.height * 0.28 - c.q.top) / c.k));
        linha.setAttribute("x2", String(p.x));
        linha.setAttribute("y2", String(p.y));
        faisca.setAttribute("cx", String(p.x));
        faisca.setAttribute("cy", String(p.y));
      };
      const apagar = () => {
        linha.remove();
        faisca.remove();
      };
      return { ponta, apagar };
    };

    const planta = PLANTAS[itens[atual].id];
    const fila = planta.nos.map(([id]) => id);
    const postos = new Set<string>();
    const feitas = new Set<string>();
    const T_NO = 420;
    const T_ARESTA = 260;
    // As linhas entre `id` e os nós já fechados. Ficam marcadas antes de
    // desenhar, para dois feixes não puxarem a mesma.
    const ligacoes = (id: string, soChegam = false) =>
      planta.arestas
        .filter(([de, para]) => (para === id && postos.has(de)) || (!soChegam && de === id && postos.has(para)))
        .filter(([de, para]) => !feitas.has(`${de}>${para}`) && Boolean(feitas.add(`${de}>${para}`)))
        .map(([de, para]) => svg.querySelector<SVGPathElement>(`.pr-ar[data-de="${de}"][data-para="${para}"]`));
    const trabalhar = async (k: number) => {
      await espera(k * 140);
      const { ponta, apagar } = feixe();
      for (let id = fila.shift(); id && !vez.parou; id = fila.shift()) {
        const g = svg.querySelector<SVGGElement>(`.pr-no[data-id="${id}"]`);
        if (!g) continue;
        // As que chegam terminam no contorno; depois ele fecha o nó e puxa
        // as que faltam.
        for (const a of ligacoes(id, true)) if (a && !vez.parou) await tracarAresta(a, T_ARESTA, vez, ponta);
        if (vez.parou) break;
        await tracarNo(g, T_NO, vez, ponta);
        postos.add(id);
        for (const a of ligacoes(id)) if (a && !vez.parou) await tracarAresta(a, T_ARESTA, vez, ponta);
      }
      apagar();
    };
    await Promise.all(Array.from({ length: FEIXES }, (_, k) => trabalhar(k)));
    if (!vez.parou) {
      // Ele olha a planta pronta e passa a vez com um estalo.
      virar("arquiteto", textos.montado);
      await espera(1300);
    }
    terminar();
  }, [atual, itens, pousarNoPalco, textos.montado, textos.montando, virar]);

  const chegada = useAoChegar<HTMLDivElement>(() => void montar(), 0.45);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        visivel.current = e.isIntersecting;
        if (!e.isIntersecting && abertoRef.current) fechar();
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ---------------------------------------------- o cartão */

  const formatar = useCallback(
    (ev: EventoNo) => {
      if (ev.t === "{taxa}") {
        const taxa = (taxaMensal(20000, 48, 712) * 100).toLocaleString(idioma === "pt" ? "pt-BR" : "en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return textos.taxa.replace("{taxa}", taxa);
      }
      return ev.t ?? "✓";
    },
    [idioma, textos.taxa],
  );

  const executar = useCallback(
    async (k: number) => {
      const svg = svgCartao.current;
      const cen = itens[atual].cenarios[k];
      if (!svg || !cen) return;
      vezCartao.current.parou = true;
      const vez: Vez = { parou: false };
      vezCartao.current = vez;
      setCenario(k);
      setRastro(cen.cliente ? [{ k: textos.cliente, t: `“${cen.cliente}”`, tipo: "cliente" }] : []);
      await rodar(svg, cen.caminho, cen.eventos, vez, (id, ev, g) => {
        setRastro((r) => [...r, { k: itens[atual].nos[id].rotulo, t: formatar(ev), tipo: ev.mal ? "mal" : undefined }]);
        if (ev.fala) {
          pousarNoNo(g);
          virar(ev.fala[0], ev.fala[1]);
        }
      });
      if (!vez.parou && cen.resposta) setRastro((r) => [...r, { k: textos.agente, t: cen.resposta!, tipo: "resposta" }]);
    },
    [atual, formatar, itens, pousarNoNo, textos.agente, textos.cliente, virar],
  );

  const abrir = useCallback(() => {
    vezMontagem.current.parou = true;
    if (!montada.current) {
      montada.current = true;
      minis.current.forEach((s) => s?.classList.remove("montando"));
      setPronta(true);
    }
    abertoRef.current = true;
    setAberto(true);
    setPorTras(false);
    setRastro([]);
    setCenario(-1);
    if (cartaoRef.current) cartaoRef.current.scrollTop = 0;
  }, []);

  function fechar() {
    if (!abertoRef.current) return;
    abertoRef.current = false;
    vezCartao.current.parou = true;
    limpar(svgCartao.current);
    setAberto(false);
    setCenario(-1);
  }

  // Ao abrir, o primeiro cenário roda sozinho; o familiar entra no cartão.
  useEffect(() => {
    if (!aberto) {
      if (montada.current) {
        virar(itens[atual].dono, itens[atual].fala);
        pousarNoPalco();
      }
      return;
    }
    if (itens[atual].cenarios.length === 0) return;
    const t = setTimeout(() => void executar(0), movimentoReduzido() ? 0 : 450);
    return () => clearTimeout(t);
    // Só a abertura dispara: trocar de cenário é com os chips.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto]);

  // As milhas não têm cenário: o controle refaz a conta e o caminho acende.
  const custo = MILHARES * milheiro + TAXAS;
  const valeMilhas = custo < PRECO;
  useEffect(() => {
    if (!aberto || itens[atual].id !== "milhas") return;
    const svg = svgCartao.current;
    if (!svg) return;
    vezCartao.current.parou = true;
    const vez: Vez = { parou: false };
    vezCartao.current = vez;
    const destino = valeMilhas ? "milhas" : "din";
    const t = setTimeout(
      () =>
        void rodar(svg, ["entrada", "calc", destino], {}, vez, (id, _ev, g) => {
          if (id !== destino) return;
          pousarNoNo(g);
          virar("mensageiro", valeMilhas ? textos.milhas.falaMilhas : textos.milhas.falaDinheiro);
        }),
      movimentoReduzido() ? 0 : 450,
    );
    return () => {
      clearTimeout(t);
      vez.parou = true;
    };
  }, [aberto, atual, itens, pousarNoNo, textos.milhas, valeMilhas, virar]);

  useEffect(() => {
    const r = rastroRef.current;
    if (r) r.scrollTop = r.scrollHeight;
  }, [rastro]);

  /* ---------------------------------------------- endereço, teclado, tamanho */

  // `#construi-<slug>` (cards do hero, fichas do time) gira até o sistema e abre.
  useEffect(() => {
    function peloEndereco() {
      const alvo = decodeURIComponent(location.hash.slice(1));
      if (!alvo.startsWith(PREFIXO_SISTEMA)) return;
      const n = itens.findIndex((it) => it.caso === alvo.slice(PREFIXO_SISTEMA.length));
      if (n < 0) return;
      ir(n);
      dispatchEvent(new CustomEvent(EVENTO_IR, { detail: "construi" }));
      setTimeout(abrir, movimentoReduzido() ? 0 : 900);
    }
    peloEndereco();
    addEventListener("hashchange", peloEndereco);
    return () => removeEventListener("hashchange", peloEndereco);
  }, [abrir, ir, itens]);

  useEffect(() => {
    function aoTeclar(e: KeyboardEvent) {
      if (!visivel.current || e.altKey || e.ctrlKey || e.metaKey) return;
      if ((e.target as HTMLElement).closest?.("input,textarea,select")) return;
      if (e.key === "Escape") return fechar();
      if (abertoRef.current) return;
      if (e.key === "ArrowLeft") ir(atual - 1);
      if (e.key === "ArrowRight") ir(atual + 1);
    }
    function aoRedimensionar() {
      if (!montada.current) return;
      if (noAlvo.current && abertoRef.current) pousarNoNo(noAlvo.current);
      else pousarNoPalco();
    }
    document.addEventListener("keydown", aoTeclar);
    addEventListener("resize", aoRedimensionar);
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      removeEventListener("resize", aoRedimensionar);
    };
  }, [atual, ir, pousarNoNo, pousarNoPalco]);

  /* ---------------------------------------------- render */

  const doca = (
    <div className="pr-doca" aria-live="polite">
      <Familiar nome={fala.nome} className="familiar-vivo size-10 shrink-0" />
      <p>
        <span className="pr-regra">
          {nomes[fala.nome]} · {regras[fala.nome]}
        </span>
        {fala.texto}
      </p>
    </div>
  );

  const passo = estreita ? 215 : 350;

  return (
    <div
      ref={(el) => {
        raiz.current = el;
        chegada.current = el;
      }}
      className="pr-cena"
      data-aberto={aberto || undefined}
    >
      <p className="rotulo !text-acento" data-obstaculo>
        {textos.rotulo}
      </p>
      <h2 className="mt-4 text-center font-gravura text-4xl leading-tight sm:text-[2.6rem]" data-obstaculo>
        {textos.titulo}
      </h2>

      <div className="pr-palco">
        {itens.map((it, j) => {
          let d = j - atual;
          if (d > itens.length / 2) d -= itens.length;
          if (d < -itens.length / 2) d += itens.length;
          const longe = Math.abs(d) > 1;
          const centro = d === 0;
          return (
            // Nome em cima, a prancha, e o convite logo embaixo dela.
            <div
              key={it.id}
              className="pr-prancha"
              data-pos={d}
              aria-hidden={longe || undefined}
              style={{
                transform: `translate(calc(-50% + ${d * passo}px), -50%) scale(${centro ? 1 : longe ? 0.45 : 0.62})`,
                opacity: longe ? 0 : centro ? 1 : 0.4,
                zIndex: 10 - Math.abs(d),
                pointerEvents: longe ? "none" : undefined,
              }}
            >
              <h3 className="pr-nome-projeto" data-obstaculo={centro || undefined}>
                {it.nome}
              </h3>
              <button
                type="button"
                className="pr-folha"
                data-obstaculo={centro || undefined}
                tabIndex={longe ? -1 : 0}
                aria-label={centro ? `${textos.verDetalhes}: ${it.nome}` : it.nome}
                onClick={() => (centro ? abrir() : ir(j))}
              >
                <Desenho prancha={it} mini svgRef={(s) => void (minis.current[j] = s)} />
                <span className="pr-vivo">{textos.rodando}</span>
                <span className="pr-carimbo">{it.setor}</span>
                <span className="pr-selo">{ROMANOS[j]}</span>
              </button>
              <div className="pr-pe" data-obstaculo={centro || undefined}>
                <button type="button" className="pr-seta" tabIndex={centro ? 0 : -1} aria-label={textos.anterior} onClick={() => ir(atual - 1)}>
                  ←
                </button>
                <button type="button" className="pr-detalhes" tabIndex={centro ? 0 : -1} onClick={abrir}>
                  {textos.verDetalhes}
                </button>
                <button type="button" className="pr-seta" tabIndex={centro ? 0 : -1} aria-label={textos.proximo} onClick={() => ir(atual + 1)}>
                  →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pr-meio" data-obstaculo aria-live="polite">
        <p className="pr-titulo">{p.titulo}</p>
        <p className="pr-numero">{p.numero}</p>
      </div>
      <div className="pr-pontos" aria-hidden>
        {itens.map((it, j) => (
          <i key={it.id} data-on={j === atual || undefined} />
        ))}
      </div>
      {!aberto && doca}

      {/* ---------------------------------------------- cartão */}
      <div className="pr-veu" onClick={fechar} aria-hidden />
      <article
        ref={cartaoRef}
        className="pr-cartao"
        role="dialog"
        aria-modal="true"
        aria-label={p.titulo}
        aria-hidden={!aberto}
        inert={!aberto}
        onWheel={(e) => e.stopPropagation()}
        onScroll={() => noAlvo.current && pousarNoNo(noAlvo.current)}
      >
        <button type="button" className="pr-fechar" aria-label={textos.fechar} onClick={fechar}>
          ×
        </button>
        <div className="pr-desenho">
          <div className="pr-cabeca" data-obstaculo>
            <span className="rotulo">
              {ROMANOS[atual]} · {textos.arquitetura}
              {p.cenarios.length > 0 && ` · ${textos.escolha}`}
            </span>
            {p.cenarios.map((c, k) => (
              <button key={c.rotulo} type="button" className="pr-chip" aria-pressed={k === cenario} onClick={() => void executar(k)}>
                {c.rotulo}
              </button>
            ))}
          </div>
          <Desenho key={p.id} prancha={p} svgRef={(s) => void (svgCartao.current = s)} />
          {p.id === "milhas" && (
            <label className="pr-controle" data-obstaculo>
              {textos.milhas.controle}
              <input type="range" min={10} max={45} value={milheiro} onChange={(e) => setMilheiro(Number(e.target.value))} />
              <b>R$ {milheiro}</b>
            </label>
          )}
          {aberto && doca}
          <div className="pr-rastro" ref={rastroRef} data-obstaculo>
            {p.id === "milhas" ? (
              <>
                <div className="pr-linha">
                  <span className="k">{p.nos.entrada.rotulo}</span>
                  <span>{textos.milhas.passagem}</span>
                </div>
                <div className="pr-linha">
                  <span className="k">{p.nos.calc.rotulo}</span>
                  <span>
                    {textos.milhas.calculo
                      .replace("{m}", String(milheiro))
                      .replace("{total}", custo.toLocaleString(idioma === "pt" ? "pt-BR" : "en-US"))}
                  </span>
                </div>
                <div className="pr-linha resposta">
                  <span className="k">→</span>
                  <span>{valeMilhas ? textos.milhas.emMilhas : textos.milhas.emDinheiro}</span>
                </div>
              </>
            ) : rastro.length === 0 ? (
              <span className="text-tinta-fraca">{textos.vazio}</span>
            ) : (
              rastro.map((l, i) => (
                <div key={i} className={`pr-linha ${l.tipo ?? ""}`}>
                  <span className="k">{l.k}</span>
                  <span>{comRisco(l.t)}</span>
                </div>
              ))
            )}
          </div>
          <div className="pr-rodape" data-obstaculo>
            <span className="rotulo">{textos.legenda}</span>
            <span className="rotulo">{p.id === "milhas" ? textos.milhas.nota : textos.simulada}</span>
          </div>
        </div>
        <div className="pr-texto" data-obstaculo>
          <p className="rotulo !text-acento">{p.setor}</p>
          <h3>{p.titulo}</h3>
          <p className="pr-corpo">{p.corpo}</p>
          <p className="pr-numero">{p.numero}</p>
          <p className="pr-stack">{p.stack.join(" · ")}</p>
          {p.caso && (
            <Link href={`/${idioma}/casos/${p.caso}`} className="pr-link">
              {textos.casoCompleto} ↗
            </Link>
          )}
          <div className="pr-tras" data-on={porTras || undefined}>
            <button type="button" aria-expanded={porTras} onClick={() => setPorTras((v) => !v)}>
              <span>{textos.porTras}</span>
              <span aria-hidden>{porTras ? "−" : "+"}</span>
            </button>
            {porTras && (
              <ul>
                {p.porTras.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </article>

      {/* ---------------------------------------------- o familiar que acompanha */}
      <div ref={famRef} className="pr-fam" data-trocando={trocando || undefined} aria-hidden>
        <div ref={balaoRef} className="pr-balao" data-lado="cima-esq" data-vazio={!fala.texto || undefined}>
          {fala.texto && (
            <>
              <span className="pr-regra">
                {nomes[fala.nome]} · {regras[fala.nome]}
              </span>
              {fala.texto}
            </>
          )}
        </div>
        <span className="pr-anel" />
        <span className="pr-corpo-fam">
          <Familiar nome={fala.nome} className="size-14" />
        </span>
        <span className="pr-nome">{nomes[fala.nome]}</span>
      </div>
    </div>
  );
}
