import { faiscador } from "@/components/faiscas";

/**
 * O ofício de cada familiar nas montagens das cenas, os mesmos gestos da
 * abertura: as letras que saem do livro do Escriba e o contorno que o
 * Arquiteto risca com o laser. Tudo em coordenadas de `raiz`, que precisa
 * estar posicionada; o que é criado aqui se remove sozinho.
 */

/** Quanto cada letra leva do livro até o seu lugar. */
export const VOO_LETRA = 300;

/** O corpo de quem está voando na cena (o Voador põe `data-nome`). */
export const corpoDe = (raiz: Element, nome: string) =>
  raiz.querySelector(`.voador[data-nome="${nome}"] .familiar`)?.getBoundingClientRect();

/**
 * O Escriba dita: cada letra sai do livro dele e voa até o seu lugar,
 * chegando quando o CSS a acende (`inicio + --i * passo` ms depois de agora;
 * sem `--i`, vale a posição na lista).
 * Devolve os relógios, para quem chama poder parar.
 */
export function ditarLetras(raiz: HTMLElement, letras: HTMLElement[], inicio: number, passo: number) {
  return letras.map((letra, i) =>
    setTimeout(
      () => {
        const texto = letra.textContent ?? "";
        const livro = corpoDe(raiz, "escriba");
        if (!texto.trim() || !livro) return;
        const base = raiz.getBoundingClientRect();
        const r = letra.getBoundingClientRect();
        const estilo = getComputedStyle(letra);
        const voa = document.createElement("span");
        voa.className = "letra-ditada";
        voa.textContent = texto;
        Object.assign(voa.style, {
          left: `${r.left - base.left}px`,
          top: `${r.top - base.top}px`,
          fontFamily: estilo.fontFamily,
          fontSize: estilo.fontSize,
          lineHeight: `${r.height}px`,
          letterSpacing: estilo.letterSpacing,
        });
        raiz.append(voa);
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
      },
      Math.max(0, inicio + Number(letra.style.getPropertyValue("--i") || i) * passo - VOO_LETRA),
    ),
  );
}

/**
 * O Arquiteto risca o contorno de `alvo` com o laser: o feixe sai do olho
 * dele, o traço cresce atrás da ponta e as faíscas saltam onde ela toca.
 * O risco some quando termina; o contorno de verdade é do CSS.
 */
export function riscarComLaser(raiz: HTMLElement, alvo: Element, ms: number) {
  return new Promise<void>((pronto) => {
    const base = raiz.getBoundingClientRect();
    const q = alvo.getBoundingClientRect();
    const x0 = q.left - base.left;
    const y0 = q.top - base.top;
    const w = q.width;
    const h = q.height;
    const P = 2 * (w + h);
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "risco-laser");
    const rect = document.createElementNS(NS, "rect");
    for (const [k, v] of [
      ["x", x0],
      ["y", y0],
      ["width", w],
      ["height", h],
    ] as const)
      rect.setAttribute(k, String(v));
    rect.style.strokeDasharray = `${P}`;
    rect.style.strokeDashoffset = `${P}`;
    const linha = document.createElementNS(NS, "line");
    svg.append(rect, linha);
    raiz.append(svg);
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
      const t = Math.min(1, (agora - inicio) / ms);
      const l = P * t;
      rect.style.strokeDashoffset = `${P - l}`;
      const p = ponto(Math.min(l, P - 0.01));
      const olho = corpoDe(raiz, "arquiteto");
      if (olho) {
        linha.setAttribute("x1", String(olho.left + olho.width / 2 - base.left));
        linha.setAttribute("y1", String(olho.top + olho.height * 0.25 - base.top));
        linha.setAttribute("x2", String(p.x));
        linha.setAttribute("y2", String(p.y));
        faiscar(raiz, p.x, p.y);
      }
      if (t < 1) return void requestAnimationFrame(quadro);
      linha.remove();
      svg.setAttribute("data-pronto", "");
      setTimeout(() => svg.remove(), 600);
      pronto();
    };
    requestAnimationFrame(quadro);
  });
}

/** O envelope, em px (igual ao `.carta-envelope` do CSS). */
const ENVELOPE = { w: 22, h: 15 };

/**
 * O Mensageiro lança o envelope até `alvo` (o botão de e-mail): ele sobe
 * num arco a partir de `de` (onde o envelope está agora), entra no botão e
 * o botão acende, como uma caixa que recebeu a carta.
 */
export function lancarEnvelope(raiz: HTMLElement, de: DOMRect, alvo: Element) {
  const base = raiz.getBoundingClientRect();
  const q = alvo.getBoundingClientRect();
  const cx = de.left + de.width / 2;
  const cy = de.top + de.height / 2;
  const env = document.createElement("span");
  env.className = "envelope-voa";
  Object.assign(env.style, {
    left: `${cx - base.left - ENVELOPE.w / 2}px`,
    top: `${cy - base.top - ENVELOPE.h / 2}px`,
  });
  raiz.append(env);
  const dx = q.left + q.width / 2 - cx;
  const dy = q.top + q.height / 2 - cy;
  env
    .animate(
      [
        { transform: "none" },
        { transform: `translate(${dx * 0.45}px, ${dy * 0.5 - 46}px) rotate(-18deg) scale(1.15)`, offset: 0.5 },
        { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(0.35)`, opacity: 0.2 },
      ],
      { duration: 560, easing: "cubic-bezier(0.4, 0, 0.6, 1)" },
    )
    .finished.then(
      () => {
        env.remove();
        alvo.classList.remove("recebeu");
        void (alvo as HTMLElement).offsetWidth;
        alvo.classList.add("recebeu");
        setTimeout(() => alvo.classList.remove("recebeu"), 700);
      },
      () => env.remove(),
    );
}
