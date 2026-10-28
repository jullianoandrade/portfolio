import type { NomeFamiliar } from "@/conteudo/tipos";

/**
 * Os seis familiares: construtos de latão, um olho aceso cada. A silhueta diz
 * o papel — quem lê tem asas de livro, quem confere é um escudo.
 *
 *   escriba     lê e escreve           livro aberto
 *   triador     classifica             prisma
 *   guardiao    confere a saída        escudo
 *   arquiteto   monta a estrutura      compasso
 *   mensageiro  entrega no lugar       dardo alado
 *   vigia       olha lá na frente      lanterna alta, de olho em você
 *
 * O brilho do olho vem de `drop-shadow` no <svg> inteiro (CSS), não de filtro
 * SVG: assim não há `id` de filtro repetido quando o mesmo familiar aparece na
 * cena e no hero ao mesmo tempo.
 */
const TRACO = "#c9a45c";
const TRACO_ESCURO = "#8c6f3a";
const CORPO = "#232b33";
const OLHO = "#f0cf86";

function Corpo({ nome }: { nome: NomeFamiliar }) {
  switch (nome) {
    case "escriba":
      return (
        <>
          <path d="M0,-4 L-20,-14 L-20,10 L0,18 L20,10 L20,-14 Z" fill={CORPO} stroke={TRACO} strokeWidth="1.5" />
          <path d="M0,-4 L0,18" stroke={TRACO} strokeWidth="1.2" />
          <path d="M-15,-6 L-5,-1 M-15,0 L-5,5 M5,-1 L15,-6 M5,5 L15,0" stroke={TRACO_ESCURO} strokeWidth="1" />
          <circle cx="0" cy="-11" r="4" fill={OLHO} />
        </>
      );
    case "triador":
      return (
        <>
          <path d="M0,-20 L19,14 L-19,14 Z" fill={CORPO} stroke={TRACO} strokeWidth="1.5" />
          <path d="M0,-20 L0,14 M-9,0 L9,0" stroke={TRACO_ESCURO} strokeWidth="1" />
          <circle cx="0" cy="3" r="3.6" fill={OLHO} />
        </>
      );
    case "guardiao":
      return (
        <>
          <path d="M0,-20 L17,-13 L15,6 Q10,17 0,21 Q-10,17 -15,6 L-17,-13 Z" fill={CORPO} stroke={TRACO} strokeWidth="1.5" />
          <path d="M0,-14 L0,15" stroke={TRACO_ESCURO} strokeWidth="1" />
          <circle cx="0" cy="-3" r="4" fill={OLHO} />
        </>
      );
    case "arquiteto":
      return (
        <>
          <circle cx="0" cy="-12" r="6.5" fill={CORPO} stroke={TRACO} strokeWidth="1.5" />
          <path d="M-3,-6 L-13,20 M3,-6 L13,20 M-8,8 L8,8" stroke={TRACO} strokeWidth="1.6" fill="none" />
          <circle cx="0" cy="-12" r="2.8" fill={OLHO} />
        </>
      );
    case "mensageiro":
      return (
        <>
          <path d="M-20,0 L14,-6 L22,0 L14,6 Z" fill={CORPO} stroke={TRACO} strokeWidth="1.5" />
          <path
            d="M-6,-3 Q-12,-18 -22,-16 Q-14,-8 -10,-2 M-6,3 Q-12,18 -22,16 Q-14,8 -10,2"
            fill="none"
            stroke={TRACO}
            strokeWidth="1.3"
          />
          <circle cx="10" cy="0" r="3.2" fill={OLHO} />
        </>
      );
    case "vigia":
      return (
        <>
          <path d="M-9,-22 L9,-22 L12,-17 L-12,-17 Z" fill={CORPO} stroke={TRACO} strokeWidth="1.4" />
          <rect x="-10" y="-17" width="20" height="30" rx="2" fill={CORPO} stroke={TRACO} strokeWidth="1.5" />
          <path d="M-10,13 L10,13 L7,19 L-7,19 Z" fill={CORPO} stroke={TRACO} strokeWidth="1.4" />
          {/* O olho dele pisca e a pupila segue você (OlharDoVigia.tsx). */}
          <g className="olho-vigia">
            <circle cx="0" cy="-2" r="5" fill={OLHO} />
            <circle className="pupila-vigia" cx="0" cy="-2" r="2" fill={CORPO} />
          </g>
        </>
      );
  }
}

/** Desenho de 48×48, centrado na origem. Decorativo: quem dá nome é a etiqueta. */
export function Familiar({ nome, className = "" }: { nome: NomeFamiliar; className?: string }) {
  return (
    <svg viewBox="-24 -24 48 48" width="48" height="48" className={`familiar ${className}`} aria-hidden>
      <Corpo nome={nome} />
    </svg>
  );
}
