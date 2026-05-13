export function calculoEntrega(cep: string, cepLoja: string): number {
    const cepDestino = Number(cep.replace(/\D/g, "").slice(0, 5))
    const cepOrigem = Number(cepLoja.replace(/\D/g, "").slice(0, 5))

    if (!cepDestino || !cepOrigem) {
        return 0
    }

    const distanciaEstimativa = Math.abs(cepDestino - cepOrigem) / 10000

    return Number((7.9 + distanciaEstimativa * 1.25).toFixed(2))
}
