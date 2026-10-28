import { Familiar } from "@/components/abertura/Familiar";
import type { NomeFamiliar } from "@/conteudo/tipos";

export type Voo = {
  nome: NomeFamiliar;
  /** Onde ele pousa, em px da raiz da cena; o canto de cima à esquerda do corpo. */
  x: number;
  y: number;
  fala?: string;
  /** Duração do voo, em ms: o Escriba anda no ritmo da escrita. */
  dur?: number;
};

/**
 * Um familiar de passagem durante a montagem de uma cena. Decorativo: o que
 * ele diz também está na cena, ou é só gesto.
 */
export function Voador({ voo, rotulo }: { voo: Voo; rotulo: string }) {
  return (
    <span
      aria-hidden
      className="voador"
      style={{ left: voo.x, top: voo.y, transitionDuration: voo.dur ? `${voo.dur}ms` : undefined }}
    >
      {voo.fala && <span className="voador-balao">{voo.fala}</span>}
      <span className="voador-corpo">
        <Familiar nome={voo.nome} className="size-12" />
      </span>
      <span className="voador-nome">{rotulo}</span>
    </span>
  );
}
