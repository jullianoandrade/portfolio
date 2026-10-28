/**
 * As faíscas de onde o laser do Arquiteto toca: pontos que saltam e caem,
 * em px dentro de `onde` (que precisa estar posicionado). Quem anima é a
 * `.faisca-voa` do globals.css; cada uma se remove quando termina.
 */
export function soltarFaiscas(onde: HTMLElement, x: number, y: number, n = 3) {
  for (let i = 0; i < n; i++) {
    const f = document.createElement("i");
    f.className = "faisca-voa";
    const angulo = Math.random() * Math.PI * 2;
    const forca = 14 + Math.random() * 30;
    f.style.left = `${x}px`;
    f.style.top = `${y}px`;
    f.style.setProperty("--dx", `${Math.cos(angulo) * forca}px`);
    // Um pouco para cima no salto; a queda vem no CSS.
    f.style.setProperty("--dy", `${Math.sin(angulo) * forca - 8}px`);
    f.addEventListener("animationend", () => f.remove());
    onde.append(f);
  }
}

/** Uma fonte de faíscas que solta no máximo uma leva a cada `ms`. */
export function faiscador(ms = 50) {
  let ultima = 0;
  return (onde: HTMLElement, x: number, y: number) => {
    const agora = performance.now();
    if (agora - ultima < ms) return;
    ultima = agora;
    soltarFaiscas(onde, x, y);
  };
}
