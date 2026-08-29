export const fmtMoney = (v: number) =>
  v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const fmtCurrency = (v: number) => `R$ ${fmtMoney(v)}`
