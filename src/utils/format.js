export const fmtGBP = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "GBP",
});

export const todayISO = () => new Date().toISOString().slice(0, 10);
export const sum = (arr) => arr.reduce((a, b) => a + b, 0);

export const groupBy = (arr, fn) =>
  arr.reduce((acc, x) => {
    const k = typeof fn === "function" ? fn(x) : x[fn];
    (acc[k] ||= []).push(x);
    return acc;
  }, {});

export const parseAmount = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const weeksBetween = (a, b) =>
  (new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24 * 7);
