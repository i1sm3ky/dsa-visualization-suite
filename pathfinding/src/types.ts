export type Mode = "grid" | "graph";

export type CellKey = `${number},${number}`;

export type CellType = "empty" | "start" | "end" | "wall" | "water" | "mud" | "sand";

export const CellWeightMap: Map<CellType, number> = new Map<CellType, number>([
  ["empty", 1],
  ["start", 2],
  ["end", 2],
  ["wall", Infinity],
  ["water", 5],
  ["mud", 10],
  ["sand", 8],
]);

export interface Cell {
  x: number;
  y: number;
  type: CellType;
  isVisited: number;
  isPath: number;
}

export type EdgeKey = `${CellKey}->${CellKey}`;
