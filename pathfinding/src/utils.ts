import { CellKey, EdgeKey } from "./types";

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function debounce<T extends (...args: any[]) => void>(func: T, timeout = 500) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

export function getEdgeKeyViaNodes(node1: CellKey, node2: CellKey): EdgeKey {
  const first = getCellRowColFromKey(node1);
  const second = getCellRowColFromKey(node2);

  const [from, to] = second[0] < first[0] || (second[0] === first[0] && second[1] < first[1]) ? [second, first] : [first, second];

  const edgeKey: EdgeKey = `${from[0]},${from[1]}->${to[0]},${to[1]}`;

  return edgeKey;
}

export function getCellRowColFromKey(key: CellKey) {
  return key.split(",").map((x) => parseInt(x));
}
