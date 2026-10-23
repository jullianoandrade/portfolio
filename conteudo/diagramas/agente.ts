/**
 * Geometria do grafo do agente conversacional.
 *
 * Fica separada do conteúdo de propósito: os rótulos são traduzidos, as
 * coordenadas não. Assim uma tradução mais longa nunca desloca o desenho.
 *
 * A ordem do array `nos` é a ordem da revelação por scroll.
 */

export interface NoGeometria {
  id: string;
  /** Centro do nó no sistema do viewBox. */
  x: number;
  y: number;
  /** Destaque visual: o guard é o ponto que a narrativa quer sublinhar. */
  enfase?: boolean;
}

export interface ArestaGeometria {
  de: string;
  para: string;
  /** Aresta condicional é tracejada. */
  condicional?: boolean;
}

export interface Diagrama {
  viewBox: string;
  larguraMinima: number;
  no: { largura: number; altura: number };
  nos: NoGeometria[];
  arestas: ArestaGeometria[];
}

export const AGENTE: Diagrama = {
  viewBox: "0 0 720 500",
  larguraMinima: 640,
  no: { largura: 168, altura: 54 },

  nos: [
    { id: "carregar", x: 110, y: 60 },
    { id: "entender", x: 360, y: 60 },
    { id: "decidir", x: 610, y: 60 },

    { id: "recuperar", x: 235, y: 190 },
    { id: "agendar", x: 485, y: 190 },

    { id: "compor", x: 110, y: 320 },
    { id: "guard", x: 360, y: 320, enfase: true },
    { id: "persistir", x: 610, y: 320 },

    { id: "handoff", x: 360, y: 440 },
  ],

  arestas: [
    { de: "carregar", para: "entender" },
    { de: "entender", para: "decidir" },

    { de: "decidir", para: "recuperar", condicional: true },
    { de: "decidir", para: "agendar", condicional: true },

    { de: "recuperar", para: "compor" },
    { de: "agendar", para: "compor" },

    { de: "compor", para: "guard" },
    { de: "guard", para: "persistir" },

    { de: "persistir", para: "handoff", condicional: true },
  ],
};

export const DIAGRAMAS: Record<string, Diagrama> = {
  agente: AGENTE,
};
