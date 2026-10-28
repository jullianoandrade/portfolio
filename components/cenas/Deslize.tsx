"use client";

import { useEffect } from "react";

/**
 * Entre as cenas a página desliza, em vez de pular no encaixe do navegador.
 *
 * Um gesto (um giro da roda, um empurrão no touchpad com a cauda de inércia,
 * uma tecla que pagina, um link para uma cena) leva a página até a próxima
 * parada num movimento só. O movimento é uma mola criticamente amortecida:
 * sai devagar, chega devagar, e um gesto novo no meio do caminho continua da
 * velocidade que já tinha. As paradas são o topo de cada cena e, numa cena
 * mais alta que a janela, degraus até o fim dela.
 *
 * O encaixe do CSS continua valendo para o dedo e para a barra de rolagem, e
 * fica desligado enquanto a página desliza (`html.deslizando`). Nada disso
 * roda com movimento reduzido nem durante a abertura.
 */

/** 1/s. Nove décimos do caminho em ~0,5 s, parada em ~1 s. */
const MOLA = 7;
/** Uma pausa maior que esta na roda encerra o gesto. */
const FIM_DO_GESTO = 180;
/** Quanto a roda precisa somar para o gesto valer. */
const LIMIAR = 30;

type Corrida = { para: number; t0: number; a: number; b: number; ultimo: number };

export const EVENTO_IR = "deslize:ir";

export function Deslize() {
  useEffect(() => {
    const html = document.documentElement;
    const reduzido = matchMedia("(prefers-reduced-motion: reduce)");
    let corrida: Corrida | null = null;
    let quadro = 0;
    const roda = { em: -1e9, pico: 0, baixo: 0, soma: 0, gasto: false };

    const ligado = () => !reduzido.matches && !html.classList.contains("abertura");
    const topo = () => parseFloat(getComputedStyle(html).scrollPaddingTop) || 0;

    function paradas() {
      const vh = innerHeight - topo();
      const max = html.scrollHeight - innerHeight;
      const lista = [0, max];
      for (const cena of document.querySelectorAll<HTMLElement>("[data-cena]")) {
        const inicio = cena.getBoundingClientRect().top + scrollY - topo();
        const sobra = cena.offsetHeight - vh;
        lista.push(inicio);
        // Cena mais alta que a janela: degraus de no máximo 85% da tela até o fim dela.
        if (sobra > 8) {
          const n = Math.ceil(sobra / (vh * 0.85));
          for (let i = 1; i <= n; i++) lista.push(inicio + (sobra * i) / n);
        }
      }
      return lista
        .map((y) => Math.round(Math.max(0, Math.min(max, y))))
        .sort((x, y) => x - y)
        .filter((y, i, todas) => i === 0 || y - todas[i - 1] > 2);
    }

    function posicao(c: Corrida, agora: number) {
      const t = Math.max(0, agora - c.t0) / 1000;
      const e = Math.exp(-MOLA * t);
      return { y: c.para + (c.a + c.b * t) * e, v: (c.b - MOLA * (c.a + c.b * t)) * e };
    }

    function terminar() {
      corrida = null;
      cancelAnimationFrame(quadro);
      quadro = 0;
      html.classList.remove("deslizando");
    }

    function passo(agora: number) {
      const c = corrida;
      if (!c) return;
      // Alguém mexeu por fora (barra, dedo, busca da página): a mola solta.
      if (Math.abs(scrollY - c.ultimo) > 2) {
        terminar();
        return;
      }
      const s = posicao(c, agora);
      const chegou = Math.abs(s.y - c.para) < 1 && Math.abs(s.v) < 30;
      scrollTo({ top: chegou ? c.para : s.y, behavior: "instant" });
      c.ultimo = scrollY;
      if (chegou) terminar();
      else quadro = requestAnimationFrame(passo);
    }

    function irPara(y: number | undefined) {
      if (y === undefined) return;
      const agora = performance.now();
      const atual = corrida ? posicao(corrida, agora) : { y: scrollY, v: 0 };
      if (!corrida && Math.abs(y - atual.y) < 1) return;
      corrida = { para: y, t0: agora, a: atual.y - y, b: atual.v + MOLA * (atual.y - y), ultimo: scrollY };
      html.classList.add("deslizando");
      if (!quadro) quadro = requestAnimationFrame(passo);
    }

    // Uma parada adiante no sentido do gesto — além do destino, se já está indo para lá.
    function irUma(sentido: 1 | -1) {
      const de = corrida && Math.sign(corrida.para - scrollY) === sentido ? corrida.para : scrollY;
      const lista = paradas();
      irPara(sentido > 0 ? lista.find((y) => y > de + 2) : lista.findLast((y) => y < de - 2));
    }

    function irParaCena(el: Element) {
      const y = el.getBoundingClientRect().top + scrollY - topo();
      irPara(paradas().findLast((p) => p <= y + 2) ?? 0);
    }

    // Um gesto move a página uma vez. Ele acaba quando a roda descansa, ou
    // quando, com a cauda da inércia abaixo da metade do pico, um empurrão
    // novo sobe bem acima do mais baixo.
    function aoRodar(e: WheelEvent) {
      if (!ligado() || e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      const agora = e.timeStamp || performance.now();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1);
      const tamanho = Math.abs(dy);
      if (agora - roda.em > FIM_DO_GESTO || (roda.gasto && roda.baixo < roda.pico / 2 && tamanho > Math.max(20, roda.baixo * 3))) {
        roda.gasto = false;
        roda.soma = 0;
        roda.pico = 0;
      }
      roda.em = agora;
      if (tamanho >= roda.pico) roda.pico = roda.baixo = tamanho;
      else roda.baixo = Math.min(roda.baixo, tamanho);
      if (roda.gasto) return;
      roda.soma += dy;
      if (Math.abs(roda.soma) >= LIMIAR) {
        roda.gasto = true;
        irUma(roda.soma > 0 ? 1 : -1);
      }
    }

    function aoTeclar(e: KeyboardEvent) {
      if (!ligado() || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const alvo = e.target as HTMLElement;
      if (alvo.closest?.("input,textarea,select,[contenteditable]")) return;
      const porTecla: Record<string, 1 | -1> = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 };
      const sentido =
        porTecla[e.key] ?? (e.key === " " && !alvo.closest?.("button,summary,[role=button]") ? (e.shiftKey ? -1 : 1) : 0);
      if (!sentido && e.key !== "Home" && e.key !== "End") return;
      e.preventDefault();
      if (e.repeat && corrida) return;
      if (sentido) irUma(sentido);
      else {
        const lista = paradas();
        irPara(e.key === "Home" ? lista[0] : lista.at(-1));
      }
    }

    // Link para uma cena: desliza até ela em vez de pular.
    function aoClicar(e: MouseEvent) {
      if (!ligado() || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const link = (e.target as HTMLElement).closest?.<HTMLAnchorElement>('a[href^="#"]');
      const alvo = link && document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (!link || !alvo) return;
      e.preventDefault();
      irParaCena(alvo);
      if (location.hash !== link.hash) history.pushState(null, "", link.hash);
    }

    // Quem precisa trazer uma cena para a tela (a bancada, ao abrir um sistema) pede por aqui.
    function aoPedir(e: Event) {
      const el = document.getElementById((e as CustomEvent<string>).detail);
      if (!el) return;
      if (ligado()) irParaCena(el);
      else el.scrollIntoView();
    }

    addEventListener("wheel", aoRodar, { passive: false });
    document.addEventListener("keydown", aoTeclar);
    document.addEventListener("click", aoClicar);
    addEventListener(EVENTO_IR, aoPedir);
    return () => {
      terminar();
      removeEventListener("wheel", aoRodar);
      document.removeEventListener("keydown", aoTeclar);
      document.removeEventListener("click", aoClicar);
      removeEventListener(EVENTO_IR, aoPedir);
    };
  }, []);

  return null;
}
