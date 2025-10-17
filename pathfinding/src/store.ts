import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Mode, CellKey, CellType, Cell, CellWeightMap } from "./types";
import { getCellRowColFromKey } from "./utils";

export interface StateStore {
  mode: Mode;
  gridDim: number[];
  cellStateMap: Map<CellKey, Cell>;
  cellWeightMatrix: number[][];
  resetGrid: boolean;
  startCellKey: CellKey | null;
  endCellKey: CellKey | null;
  prevStartCellState: Partial<Cell> | null;
  prevEndCellState: Partial<Cell> | null;
  currentTool: CellType;
  isMouseDown: boolean;
  draggingStart: boolean;
  draggingEnd: boolean;
  realtime: boolean;
  animationSpeed: number;
  disableButtons: boolean;
  currentAlgo: string;
  timeElapsed: number;

  setMode: (mode: Mode) => void;
  setGridDim: (dim: [number, number]) => void;
  setCellStateMap: (cellStateMap: Map<CellKey, Cell>) => void;
  setCellState: (x: number, y: number, updates: Partial<Cell>) => void;
  setBatchCellState: (updates: Array<{ x: number; y: number; updates: Partial<Cell> }>) => void;
  resetGridState: () => void;
  setVisited: (key: CellKey, visitIndex: number) => void;
  setPath: (key: CellKey, pathIndex: number) => void;
  resetPathAndVisited: () => void;
  setCurrentTool: (tool: CellType) => void;
  setMouseDown: (down: boolean) => void;
  setDraggingStart: (dragging: boolean) => void;
  setDraggingEnd: (dragging: boolean) => void;
  setRealtime: (status: boolean) => void;
  setAnimationSpeed: (speed: number) => void;
  setDisableButtons: (status: boolean) => void;
  setCurrentAlgo: (algo: string) => void;
  setTimeElapsed: (time: number) => void;
}

export const useStateStore = create<StateStore>()(
  immer((set) => ({
    mode: "grid",
    gridDim: [12, 30],
    cellStateMap: new Map(),
    cellWeightMatrix: [],
    resetGrid: false,
    startCellKey: null,
    endCellKey: null,
    prevStartCellState: null,
    prevEndCellState: null,
    currentTool: "wall",
    isMouseDown: false,
    draggingStart: false,
    draggingEnd: false,
    realtime: false,
    animationSpeed: 20,
    disableButtons: false,
    currentAlgo: "Breadth-first Search",
    timeElapsed: 0,

    setMode: (mode) => set({ mode }),

    setGridDim: (dim) => set({ gridDim: dim }),

    setCellStateMap: (map) => {
      set((state) => {
        const [rows, cols] = state.gridDim;

        const cellWeightMatrix = Array.from({ length: rows }, () => Array(cols).fill(0));

        for (const [key, value] of map.entries()) {
          const [row, col] = key.split(",").map(Number);
          cellWeightMatrix[row][col] = CellWeightMap.get(value.type);
        }

        state.cellStateMap = map;
        state.cellWeightMatrix = cellWeightMatrix;
      });
    },

    setCellState: (x, y, updates) => {
      set((state) => {
        const key: CellKey = `${x},${y}`;
        const cell = state.cellStateMap.get(key);
        if (!cell) return;

        if (updates.type === "start" && cell.type === "end") return;
        if (updates.type === "end" && cell.type === "start") return;

        if (updates.type === "start") {
          if (state.startCellKey && state.startCellKey !== key) {
            const prevStartCell = state.cellStateMap.get(state.startCellKey);
            if (prevStartCell) {
              Object.assign(prevStartCell, {
                type: state.prevStartCellState?.type,
                isvisited: state.prevStartCellState?.isVisited,
                isPath: state.prevStartCellState?.isPath,
              });

              let [prevX, prevY] = getCellRowColFromKey(state.startCellKey);
              state.cellWeightMatrix[prevX][prevY] = CellWeightMap.get(state.prevStartCellState?.type!)!;
            }
          }

          state.prevStartCellState = (({ type, isVisited, isPath }) => ({ type, isVisited, isPath }))(cell);
          Object.assign(cell, {
            type: "start",
            isVisited: 0,
            isPath: 0,
          });

          state.cellWeightMatrix[x][y] = CellWeightMap.get("start")!;

          state.startCellKey = key;
        } else if (updates.type === "end") {
          if (state.endCellKey && state.endCellKey !== key) {
            const prevEndCell = state.cellStateMap.get(state.endCellKey);
            if (prevEndCell) {
              Object.assign(prevEndCell, {
                type: state.prevEndCellState?.type,
                isvisited: state.prevEndCellState?.isVisited,
                isPath: state.prevEndCellState?.isPath,
              });

              let [prevX, prevY] = getCellRowColFromKey(state.endCellKey);
              state.cellWeightMatrix[prevX][prevY] = CellWeightMap.get(state.prevEndCellState?.type!)!;
            }
          }

          state.prevEndCellState = (({ type, isVisited, isPath }) => ({ type, isVisited, isPath }))(cell);
          Object.assign(cell, {
            type: "end",
            isVisited: 0,
            isPath: 0,
          });

          state.cellWeightMatrix[x][y] = CellWeightMap.get("end")!;

          state.endCellKey = key;
        } else {
          if (cell.type !== "start" && cell.type !== "end") {
            if (updates.type && updates.type !== cell.type) {
              state.cellWeightMatrix[x][y] = CellWeightMap.get(updates.type)!;
            }

            Object.assign(cell, updates);
          }
        }
      });
    },

    setBatchCellState: (updates) => {
      set((state) => {
        for (const { x, y, updates: cellUpdates } of updates) {
          const key: CellKey = `${x},${y}`;
          const cell = state.cellStateMap.get(key);

          if (cell && cell.type !== "start" && cell.type !== "end") {
            if (cellUpdates.type && cellUpdates.type !== cell.type) {
              state.cellWeightMatrix[x][y] = CellWeightMap.get(cellUpdates.type)!;
            }

            Object.assign(cell, cellUpdates);
          }
        }
      });
    },

    resetGridState: () =>
      set((state) => {
        state.resetGrid = !state.resetGrid;
      }),

    setVisited: (key, visitIndex) => {
      set((state) => {
        const cell = state.cellStateMap.get(key);
        if (cell && cell.type !== "start" && cell.type !== "end") {
          cell.isVisited = visitIndex;
        }
      });
    },

    setPath: (key, pathIndex) => {
      set((state) => {
        const cell = state.cellStateMap.get(key);
        if (cell && cell.type !== "start" && cell.type !== "end") {
          cell.isPath = pathIndex;
        }
      });
    },

    resetPathAndVisited: () => {
      set((state) => {
        for (const [, cell] of state.cellStateMap) {
          if (cell) {
            cell.isPath = 0;
            cell.isVisited = 0;
          }
        }
      });
    },

    setCurrentTool: (tool) => set({ currentTool: tool }),

    setMouseDown: (down) => set({ isMouseDown: down }),

    setDraggingStart: (dragging) => set({ draggingStart: dragging }),

    setDraggingEnd: (dragging) => set({ draggingEnd: dragging }),

    setRealtime: (status) => set({ realtime: status }),

    setAnimationSpeed: (speed) => set({ animationSpeed: speed }),

    setDisableButtons: (status) => set({ disableButtons: status }),

    setCurrentAlgo: (algo) => set({ currentAlgo: algo }),

    setTimeElapsed: (time) => set({ timeElapsed: time }),
  }))
);
