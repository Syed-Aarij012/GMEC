// Guards against floating-point noise (e.g. 8.280000000000001) from chained
// arithmetic on money values before they're stored or returned from an API.
export function roundMoney(amount: number): number {
  return Math.round(amount * 100) / 100;
}
