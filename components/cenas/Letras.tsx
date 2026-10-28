import { Fragment } from "react";

/**
 * Um texto letra por letra, para a montagem animar cada uma (`--i` é a
 * ordem). As letras vêm agrupadas por palavra: a linha só quebra entre
 * palavras, nunca no meio de uma. Decorativo: quem envolve põe o texto
 * inteiro em `aria-label`.
 */
export function Letras({ texto, classe, inicio = 0 }: { texto: string; classe: string; inicio?: number }) {
  const palavras = texto.split(" ");
  const comeco = palavras.map((_, k) => inicio + palavras.slice(0, k).reduce((soma, p) => soma + p.length + 1, 0));
  return (
    <>
      {palavras.map((palavra, k) => (
        <Fragment key={k}>
          {k > 0 && " "}
          <span className="palavra" aria-hidden>
            {Array.from(palavra).map((c, j) => (
              <span key={j} className={classe} style={{ "--i": comeco[k] + j } as React.CSSProperties}>
                {c}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </>
  );
}
