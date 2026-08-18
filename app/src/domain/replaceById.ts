export function replaceById<T extends { id: string }>(
  list: T[],
  id: string,
  patch: Partial<T> | ((item: T) => T),
): T[] {
  return list.map((item) => {
    if (item.id !== id) return item;
    return typeof patch === "function" ? patch(item) : { ...item, ...patch };
  });
}
