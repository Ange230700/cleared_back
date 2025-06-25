// src\utils\bigint-to-number.ts

export function toJSONSafe(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(toJSONSafe);
  }
  if (obj && typeof obj === "object") {
    const res: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "bigint") res[k] = Number(v);
      else if (typeof v === "object") res[k] = toJSONSafe(v);
      else res[k] = v;
    }
    return res;
  }
  return obj;
}
