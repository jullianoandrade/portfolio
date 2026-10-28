/**
 * A geometria das pranchas: onde fica cada nó e por onde passa cada aresta.
 *
 * Fica separada do conteúdo pelo mesmo motivo do `conteudo/diagramas`: os
 * rótulos se traduzem, as coordenadas não. O viewBox é 560 × 340 e cada nó
 * é um retângulo de 120 × 40 centrado em (x, y). As colunas ficam em 80, 280
 * e 480: o vão entre elas é onde o familiar pousa sem cobrir nada.
 */

export const LARGURA = 560;
export const ALTURA = 340;
export const NO = { largura: 120, altura: 40 };

export type NoPlanta = [id: string, x: number, y: number];
/** Aresta condicional é tracejada. `volta` desenha o laço de retorno por baixo. */
export type ArestaPlanta = [de: string, para: string, tipo?: "condicional" | "volta"];

export interface Planta {
  nos: NoPlanta[];
  arestas: ArestaPlanta[];
}

/**
 * O nó onde mora a regra do dono de cada prancha: é ali que ele olha quando
 * o pacote passa (o guard para o Guardião, a máscara para o Escriba...).
 */
export const CHAVE: Record<string, string> = {
  atendimento: "guard",
  diagnostico: "ia",
  contratos: "mask",
  leads: "llm",
  laudo: "proj",
  milhas: "calc",
};

export const PLANTAS: Record<string, Planta> = {
  atendimento: {
    nos: [
      ["carregar", 80, 40],
      ["entender", 280, 40],
      ["decidir", 480, 40],
      ["recuperar", 180, 140],
      ["agendar", 380, 140],
      ["compor", 80, 240],
      ["guard", 280, 240],
      ["persistir", 480, 240],
      ["handoff", 280, 310],
    ],
    arestas: [
      ["carregar", "entender"],
      ["entender", "decidir"],
      ["decidir", "recuperar", "condicional"],
      ["decidir", "agendar", "condicional"],
      ["recuperar", "compor"],
      ["agendar", "compor"],
      ["compor", "guard"],
      ["guard", "persistir"],
      ["persistir", "handoff", "condicional"],
    ],
  },
  diagnostico: {
    nos: [
      ["portais", 80, 40],
      ["apis", 80, 140],
      ["rpa", 280, 40],
      ["pastas", 280, 140],
      ["import", 480, 140],
      ["diag", 480, 250],
      ["prints", 280, 250],
      ["ia", 80, 250],
    ],
    arestas: [
      ["portais", "rpa"],
      ["apis", "pastas"],
      ["rpa", "pastas"],
      ["pastas", "import"],
      ["import", "diag"],
      ["rpa", "prints", "condicional"],
      ["prints", "ia"],
      ["ia", "rpa", "volta"],
    ],
  },
  contratos: {
    nos: [
      ["pdf", 80, 60],
      ["mask", 280, 60],
      ["llm", 480, 60],
      ["calc", 480, 190],
      ["ref", 280, 190],
      ["res", 280, 300],
    ],
    arestas: [
      ["pdf", "mask"],
      ["mask", "llm"],
      ["llm", "calc"],
      ["ref", "calc"],
      ["calc", "res"],
    ],
  },
  leads: {
    nos: [
      ["quiz", 80, 130],
      ["llm", 280, 130],
      ["base", 480, 60],
      ["time", 480, 210],
    ],
    arestas: [
      ["quiz", "llm"],
      ["llm", "base"],
      ["base", "time"],
    ],
  },
  laudo: {
    nos: [
      ["reuniao", 80, 130],
      ["proj", 280, 60],
      ["concl", 280, 200],
      ["pdf", 480, 130],
      ["rev", 480, 270],
    ],
    arestas: [
      ["reuniao", "proj"],
      ["proj", "concl"],
      ["concl", "pdf"],
      ["pdf", "rev"],
    ],
  },
  milhas: {
    nos: [
      ["entrada", 80, 130],
      ["calc", 280, 130],
      ["milhas", 480, 60],
      ["din", 480, 210],
    ],
    arestas: [
      ["entrada", "calc"],
      ["calc", "milhas", "condicional"],
      ["calc", "din", "condicional"],
    ],
  },
};

/** O traçado de uma aresta: reta entre nós alinhados, curva entre os demais. */
export function tracado(planta: Planta, [de, para, tipo]: ArestaPlanta) {
  const pos = new Map(planta.nos.map(([id, x, y]) => [id, [x, y] as const]));
  const [ax, ay] = pos.get(de)!;
  const [bx, by] = pos.get(para)!;
  const meiaL = NO.largura / 2;
  const meiaA = NO.altura / 2;
  if (tipo === "volta") {
    return `M${ax},${ay - meiaA} C${ax},${by + 60} ${bx - 70},${by + 30} ${bx - meiaL - 4},${by + 6}`;
  }
  if (Math.abs(by - ay) < 5) {
    const s = Math.sign(bx - ax);
    return `M${ax + s * meiaL},${ay} L${bx - s * (meiaL + 3)},${by}`;
  }
  const s = Math.sign(by - ay);
  const y1 = ay + s * meiaA;
  const y2 = by - s * (meiaA + 3);
  if (Math.abs(bx - ax) < 5) return `M${ax},${y1} L${bx},${y2}`;
  const m = (y1 + y2) / 2;
  return `M${ax},${y1} C${ax},${m} ${bx},${m} ${bx},${y2}`;
}
