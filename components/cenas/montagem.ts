"use client";

import { useEffect, useRef } from "react";

import { movimentoReduzido } from "./Anfitriao";

/**
 * A montagem de uma cena pelos familiares: uma sequência de estados em
 * `data-montagem` na raiz da cena, que o CSS traduz em quem aparece e
 * quando. Cada passo é `[estado, duração em ms]`.
 *
 * - Toca uma vez por visita (sessionStorage), quando a cena chega na tela.
 * - Se a cena sai da tela no meio, termina na hora: nada fica pela metade.
 * - Não toca com movimento reduzido, nem se a cena já está à vista quando a
 *   página carrega (um link direto não esconde o que a pessoa já vê).
 * - Sem JavaScript, o atributo nunca é posto: a cena aparece pronta.
 *
 * `aoPasso` recebe cada estado, e `"fim"` no final, para quem voa.
 */
export function useMontagem<T extends HTMLElement>(
  chave: string,
  passos: [string, number][],
  aoPasso?: (estado: string, raiz: T) => void,
) {
  const ref = useRef<T>(null);
  const roteiro = useRef({ passos, aoPasso });
  useEffect(() => {
    roteiro.current = { passos, aoPasso };
  });

  useEffect(() => {
    const raiz = ref.current;
    if (!raiz) return;
    const marca = `montada-${chave}`;
    let vista = false;
    try {
      vista = Boolean(sessionStorage.getItem(marca));
    } catch {}
    const q = raiz.getBoundingClientRect();
    if (vista || movimentoReduzido() || (q.top < innerHeight && q.bottom > 0)) return;

    const { passos: lista } = roteiro.current;
    const avisar = (estado: string) => roteiro.current.aoPasso?.(estado, raiz);
    raiz.dataset.montagem = lista[0][0];
    const relogios: ReturnType<typeof setTimeout>[] = [];
    let rodando = false;
    let acabou = false;

    function terminar() {
      if (acabou) return;
      acabou = true;
      relogios.forEach(clearTimeout);
      delete raiz!.dataset.montagem;
      avisar("fim");
      observador.disconnect();
      try {
        sessionStorage.setItem(marca, "1");
      } catch {}
    }

    const observador = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !rodando) {
          rodando = true;
          let t = 0;
          lista.forEach(([estado, ms], i) => {
            if (i === 0) avisar(estado);
            else
              relogios.push(
                setTimeout(() => {
                  raiz.dataset.montagem = estado;
                  avisar(estado);
                }, t),
              );
            t += ms;
          });
          relogios.push(setTimeout(terminar, t));
        } else if (!e.isIntersecting && rodando) terminar();
      },
      { threshold: 0.4 },
    );
    observador.observe(raiz);
    return () => {
      observador.disconnect();
      relogios.forEach(clearTimeout);
      delete raiz.dataset.montagem;
    };
  }, [chave]);

  return ref;
}

/**
 * Um ponto de `alvo` em coordenadas de `raiz`: `fx`/`fy` são frações do alvo.
 * O x fica dentro da raiz (o corpo de quem voa tem 48 px): na tela estreita,
 * quem trabalharia ao lado do alvo trabalha na borda, à vista.
 */
export function pontoEm(raiz: Element, alvo: Element | null, fx: number, fy: number, dx = 0, dy = 0) {
  if (!alvo) return null;
  const r = raiz.getBoundingClientRect();
  const q = alvo.getBoundingClientRect();
  const x = q.left - r.left + q.width * fx + dx;
  return { x: Math.min(Math.max(x, 0), r.width - 48), y: q.top - r.top + q.height * fy + dy };
}

/** A tela estreita do celular (a mesma das pranchas). */
export const estreita = () => matchMedia("(max-width: 639px)").matches;
