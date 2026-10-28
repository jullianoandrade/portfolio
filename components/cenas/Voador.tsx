import { Familiar } from "@/components/abertura/Familiar";
import type { NomeFamiliar } from "@/conteudo/tipos";

export type Voo = {
  nome: NomeFamiliar;
  /** Onde ele pousa, em px da raiz da cena; o canto de cima à esquerda do corpo. */
  x: number;
  y: number;
  /** Duração do voo, em ms: o Escriba anda no ritmo da escrita. */
  dur?: number;
  /**
   * O gesto do ofício (o CSS anima): o Guardião investe com o escudo; quem
   * está em `voar` leva o vento atrás.
   */
  gesto?: "investir" | "voar";
  /** O Mensageiro chega trazendo um envelope. */
  carta?: boolean;
  /** Virado para a esquerda, como o Mensageiro que mora no contato. */
  espelho?: boolean;
};

/**
 * Um familiar de passagem durante a montagem de uma cena. Decorativo e
 * calado: ele só trabalha.
 */
export function Voador({ voo, rotulo }: { voo: Voo; rotulo: string }) {
  return (
    <span
      aria-hidden
      className="voador"
      data-nome={voo.nome}
      data-gesto={voo.gesto}
      style={{ left: voo.x, top: voo.y, transitionDuration: voo.dur ? `${voo.dur}ms` : undefined }}
    >
      <span className="voador-corpo">
        <Familiar nome={voo.nome} className={`size-12 ${voo.espelho ? "-scale-x-100" : ""}`} />
        {voo.carta && <span className="voador-envelope" />}
      </span>
      <span className="voador-nome">{rotulo}</span>
    </span>
  );
}
