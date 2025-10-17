export async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export function compareFunc(order) {
  if (order === "asc") {
    return (a, b) => a - b;
  } else if (order === "desc") {
    return (a, b) => b - a;
  }
}
